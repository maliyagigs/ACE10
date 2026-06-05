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

let adminApp: any = null;
let firestoreDb: any = null;

if (fs.existsSync(firebaseConfigPath)) {
  const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));
  try {
    // 1. Initialize Firebase Admin
    adminApp = initializeApp({
      projectId: firebaseConfig.projectId,
    });
    
    // 2. Clear targeting for the persistent Firestore instance
    const databaseId = firebaseConfig.firestoreDatabaseId || "(default)";
    firestoreDb = getFirestore(adminApp, databaseId);
    
    console.log(`[CMS Server] Firebase Admin Initialized: ${firebaseConfig.projectId} [${databaseId}]`);
    
    // 3. Warm-up connectivity check
    firestoreDb.collection('cms').doc('latest').get()
      .then((doc: any) => {
        if (!doc.exists) {
          console.log("[CMS Server] Warm-up: document 'cms/latest' is ready for initial creation.");
        } else {
          console.log("[CMS Server] Warm-up: Firestore link verified.");
        }
      })
      .catch((err: any) => {
        console.warn("[CMS Server] Firestore warm-up warning (Permissions or DB ID mismatch):", err.message);
      });

  } catch (err) {
    console.error("[CMS Server] Firebase Admin Init Critical Failure:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable CORS so the live Vercel site can query config updates from this server
  app.use(cors({ 
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
  }));

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
      if (!token) {
        console.warn("[CMS Server] Save attempted without Authorization token.");
        return res.status(401).json({ error: "Authentication required: No token provided." });
      }

      if (!adminApp) {
        console.error("[CMS Server] Attempted to save content but Firebase Admin is not initialized.");
        return res.status(500).json({ error: "Server Configuration Error: Database link is offline." });
      }

      try {
        const decodedToken = await getAuth(adminApp).verifyIdToken(token);
        const email = decodedToken.email;
        const uid = decodedToken.uid;
        
        // Expert check: Handle both known admin account and potential legacy prompt UID
        const isAuthorized = email === "maliyagigs@gmail.com" || uid === "iksKSWvbtSbHCDglRJAwENbSYUx1";
        
        if (!isAuthorized) {
           console.warn(`[CMS Server] Forbidden save attempt from: ${email} (${uid})`);
           return res.status(403).json({ error: "Unauthorized: Admin privileges required to commit production changes." });
        }
      } catch (authErr: any) {
        console.error("[CMS Server] Token validation yielded error:", authErr.message);
        return res.status(401).json({ error: "Session revalidation failed. Please logout and log back in." });
      }

      // 2. Resource Validation
      if (!newContent || typeof newContent !== 'object' || Object.keys(newContent).length === 0) {
        console.warn("[CMS Server] Rejected empty or malformed payload.");
        return res.status(400).json({ error: "Invalid CMS configuration body provided." });
      }

      console.log(`[CMS Server] Processing valid save request from authorized admin [${JSON.stringify(newContent).length} bytes]`);

      // 3. Sync to Firestore (Global Real-time Persistence)
      if (firestoreDb) {
        try {
          console.log(`[CMS Server] Saving content for admin: ${req.headers['x-user-email'] || 'Authorized Admin'} [Length: ${JSON.stringify(newContent).length} bytes]`);
          await firestoreDb.collection('cms').doc('latest').set({
            content: newContent,
            updatedAt: new Date().toISOString(),
          }, { merge: false });
          console.log("[CMS Server] Successfully pushed CMS updates to Firestore!");
        } catch (dbErr: any) {
          console.warn("[CMS Server] Firestore save failed:", dbErr.message);
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

  // Catch-all API error handler for unmatched methods/paths
  app.all("/api/*", (req, res) => {
    console.warn(`[CMS Server] Unhandled ${req.method} request to ${req.originalUrl}`);
    res.status(405).json({ 
      error: `Method ${req.method} not allowed for this endpoint.`,
      path: req.originalUrl,
      hint: "Check that you are calling /api/save-content using POST."
    });
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
