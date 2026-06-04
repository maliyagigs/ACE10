import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable CORS so the live Vercel site can query config updates from this server
  app.use(cors({ origin: "*" }));

  app.use((req, res, next) => {
    if (req.url.includes('/api/')) {
      console.log(`[CMS Server] Incoming API Request: ${req.method} ${req.url}`);
    }
    next();
  });

  // Configure JSON body parser to accept full CMS configurations
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  const dynamicJsonPath = path.join(process.cwd(), "src", "content-dynamic.json");

  // Helper to retrieve state cleanly from JSON or data.ts template file
  function getContentData() {
    if (fs.existsSync(dynamicJsonPath)) {
      try {
        return JSON.parse(fs.readFileSync(dynamicJsonPath, "utf-8"));
      } catch (err) {
        console.error("[CMS Server] Failed parsing content-dynamic.json:", err);
      }
    }

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
  app.get("/api/get-content", (req, res) => {
    const data = getContentData();
    if (data) {
      return res.json(data);
    }
    return res.status(404).json({ error: "CMS configuration template could not be loaded." });
  });

  // API Route: Saves updated content back into the workspace's data.ts
  app.post("/api/save-content", (req, res) => {
    console.log("[CMS Server] Received POST to /api/save-content", req.body ? Object.keys(req.body).length : "No body");
    try {
      const newContent = req.body;
      if (!newContent || typeof newContent !== 'object' || Object.keys(newContent).length === 0) {
        return res.status(400).json({ error: "Invalid CMS configuration body" });
      }

      // 1. Write the backup file as clean JSON for ultra fast loads
      fs.writeFileSync(dynamicJsonPath, JSON.stringify(newContent, null, 2), "utf-8");

      // 2. Reference path to the shared data file
      const dataFilePath = path.join(process.cwd(), "src", "data.ts");
      
      // Formulate complete type-safe TypeScript content
      const fileContent = `import { AppContent } from './types';\n\nexport const initialContent: AppContent = ${JSON.stringify(newContent, null, 2)};\n`;

      // Overwrite src/data.ts
      fs.writeFileSync(dataFilePath, fileContent, "utf-8");
      
      console.log("[CMS Server] Successfully written CMS updates to /src/data.ts!");
      return res.json({ 
        success: true, 
        message: "Your edits were successfully written to the default data.ts file in the live workspace codebase! This will automatically trigger a commit synchronization & Vercel deployment." 
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
