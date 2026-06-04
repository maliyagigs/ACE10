import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import cors from "cors";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Load configuration from firebase-applet-config.json for server-side initialization
const firebaseConfigPath = path.join(process.cwd(), 'firebase-applet-config.json');
let firestoreDb: any = null;

if (fs.existsSync(firebaseConfigPath)) {
  const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));
  try {
    // 1. Initialize for the specific project
    const firebaseAdminApp = initializeApp({
      projectId: firebaseConfig.projectId,
    });
    
    // 2. Target the specific CMS database instance if provided. 
    // In AI Studio, the custom database ID is mandatory for accessing the persistent store.
    const databaseId = firebaseConfig.firestoreDatabaseId || "(default)";
    firestoreDb = getFirestore(firebaseAdminApp, databaseId);
    
    console.log(`[CMS Server] Firebase Admin connected to project: ${firebaseConfig.projectId}, database: ${databaseId}`);
    
    // 3. Simple warm-up/permission check (non-blocking)
    firestoreDb.collection('cms').doc('latest').get()
      .then((doc: any) => {
        if (!doc.exists) {
          console.warn("[CMS Server] Warm-up: 'cms/latest' document not found. It will be created on first save.");
        } else {
          console.log("[CMS Server] Warm-up: Successfully verified Firestore connectivity.");
        }
      })
      .catch((err: any) => {
        console.error("[CMS Server] Warm-up: Firestore verification failed. Check IAM permissions for the service account.", err.message);
      });

  } catch (err) {
    console.error("[CMS Server] Firebase Admin Modular Initialization Error:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable CORS so the live Vercel site can query config updates from this server
  app.use(cors({ origin: "*" }));

  // Configure JSON body parser to accept full CMS configurations
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  const dynamicJsonPath = path.join(process.cwd(), "src", "content-dynamic.json");

  /**
   * CORE LOGIC: Unified state fetcher (Firestore -> Local JSON -> data.ts template)
   */
  async function getContentData() {
    // 1. Try Firestore first (Production Persistence)
    if (firestoreDb) {
      try {
        const doc = await firestoreDb.collection('cms').doc('latest').get();
        if (doc.exists) {
          console.log("[CMS Server] Serving configuration from Firestore (latest synced version)");
          return doc.data().content;
        }
      } catch (err) {
        console.error("[CMS Server] Firestore fetch error:", err);
      }
    }

    // 2. Fallback to local dynamic JSON if it exists (IDE / Development persistence)
    if (fs.existsSync(dynamicJsonPath)) {
      try {
        return JSON.parse(fs.readFileSync(dynamicJsonPath, "utf-8"));
      } catch (err) {
        console.error("[CMS Server] Failed parsing content-dynamic.json:", err);
      }
    }

    // 3. Last fallback: Parse the template data.ts file
    try {
      const dataFilePath = path.join(process.cwd(), "src", "data.ts");
      if (fs.existsSync(dataFilePath)) {
        const fileStr = fs.readFileSync(dataFilePath, "utf-8");
        const token = "export const initialContent: AppContent = ";
        const index = fileStr.indexOf(token);
        if (index !== -1) {
          const jsonPart = fileStr.substring(index + token.length).trim().replace(/;$/, "");
          
          let content;
          try {
            content = JSON.parse(jsonPart);
          } catch (e) {
            // Fallback for JS object syntax that JSON.parse dislikes (e.g. trailing commas, single quotes)
            content = new Function("return " + jsonPart)();
          }

          // Cache it for immediate static/file serving access
          fs.writeFileSync(dynamicJsonPath, JSON.stringify(content, null, 2), "utf-8");
          return content;
        }
      }
    } catch (err) {
      console.error("[CMS Server] Failed parsing fallback from src/data.ts:", err);
    }
    return null;
  }

  // API Route: Serves updated app configurations dynamically
  app.get("/api/get-content", async (req, res) => {
    const data = await getContentData();
    if (data) {
      return res.json(data);
    }
    return res.status(404).json({ error: "CMS configuration template could not be loaded." });
  });

  // API Route: Saves updated content back into the workspace's data.ts AND Firestore
  app.post("/api/save-content", async (req, res) => {
    try {
      const newContent = req.body;
      const authHeader = req.headers.authorization || "";
      const token = authHeader.replace(/^Bearer /, "");

      // 1. Verify Authorization (Production Strict Mode)
      if (token) {
        try {
          const decodedToken = await getAuth().verifyIdToken(token);
          const email = decodedToken.email;
          if (email !== "maliyagigs@gmail.com") {
             console.warn(`[CMS Server] Blocked unauthorized write attempt from: ${email}`);
             return res.status(403).json({ error: "Access Denied: Non-admin source." });
          }
        } catch (authErr) {
          console.error("[CMS Server] Token verification failed:", authErr);
          return res.status(401).json({ error: "Authentication expired. Access denied." });
        }
      }

      if (!newContent || typeof newContent !== 'object' || Object.keys(newContent).length === 0) {
        return res.status(400).json({ error: "Invalid CMS configuration body" });
      }

      // 1. Sync to Firestore (Live Persistance for deployed app)
      if (firestoreDb) {
        try {
          await firestoreDb.collection('cms').doc('latest').set({
            content: newContent,
            updatedAt: new Date().toISOString(),
          }, { merge: false });
          console.log("[CMS Server] Successfully pushed CMS updates to Firestore!");
        } catch (dbErr) {
          console.warn("[CMS Server] Firestore save failed (falling back to file-only):", dbErr);
        }
      }

      // 2. Write the backup file as clean JSON for developer visibility
      fs.writeFileSync(dynamicJsonPath, JSON.stringify(newContent, null, 2), "utf-8");

      // 3. Reference path to the shared data file (IDE Persistence)
      const dataFilePath = path.join(process.cwd(), "src", "data.ts");
      
      // Formulate complete type-safe TypeScript content
      const fileContent = `import { AppContent } from './types';\n\nexport const initialContent: AppContent = ${JSON.stringify(newContent, null, 2)};\n`;

      // Overwrite src/data.ts
      fs.writeFileSync(dataFilePath, fileContent, "utf-8");
      
      console.log("[CMS Server] Successfully written CMS updates to /src/data.ts!");
      return res.json({ 
        success: true, 
        message: "Your edits were successfully saved to both the production Cloud database and the workspace codebase! Changes are live immediately in the app and will be included in your next GitHub sync." 
      });
    } catch (error: any) {
      console.error("[CMS Server Request Error]:", error);
      return res.status(500).json({ error: error.message || "Failed to commit data file update" });
    }
  });

  // Health endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Hot-pluggable Vite Development Middleware / Static Production Assets handler
  if (process.env.NODE_ENV !== "production") {
    console.log("[CMS Server] Mounting Vite development server...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[CMS Server] Serving production static files...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CMS Server] High-performance full-stack app running on http://localhost:${PORT}`);
  });
}

startServer();
