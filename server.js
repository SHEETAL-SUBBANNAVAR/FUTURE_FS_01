import express from "express";
import { createServer as createViteServer } from "vite";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Database setup
  const db = await open({
    filename: "portfolio.db",
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  app.use(express.json());

  // API Routes
  app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      // Store in database
      await db.run(
        "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)",
        [name, email, message]
      );

      // Email notification (Mocked/Configurable)
      // In a real scenario, you'd use real credentials from process.env
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER, // Send to self
          subject: `New Portfolio Message from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        });
      } else {
        console.log("Email credentials not provided, skipping email notification.");
      }

      res.status(200).json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
      console.error("Error processing contact form:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
