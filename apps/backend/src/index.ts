import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import routes from "./routes";
import path from "path";
import fs from "fs";
import { LicenseModel } from "./models/license.model";

// Attempt to load env files from several possible locations
const envPaths = [
  path.resolve(process.cwd(), ".env"), // current working dir
  path.resolve(process.cwd(), "../.env"), // one level up
  path.resolve(process.cwd(), "../../.env"), // two levels up
  path.resolve(__dirname, "../../../.env"), // project root when running from src
];

let envLoaded = false;
for (const p of envPaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  dotenv.config(); // fallback to default lookup
}

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Health check
app.get("/api/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

// Root endpoint for basic health checks and info
app.get("/", (_, res) => {
  res.status(200).json({
    message: "Learningoo API Server",
    version: "0.1.0",
    status: "running",
    endpoints: {
      health: "/api/health",
      docs: "/api",
    },
  });
});

// TODO: mount routes here
app.use("/api", routes);

(async () => {
  await connectDB();
  // Seed default licenses if none exist
  const count = await LicenseModel.countDocuments();
  if (count === 0) {
    await LicenseModel.insertMany([
      {
        name: "Free",
        slug: "free",
        price: 0,
        courseLimit: 1,
        chapterLimit: 3,
        lessonLimit: 2,
      },
      {
        name: "Startup",
        slug: "startup",
        price: 9,
        courseLimit: 5,
        chapterLimit: null,
        lessonLimit: null,
      },
      {
        name: "Advanced",
        slug: "advanced",
        price: 16,
        courseLimit: 10,
        chapterLimit: null,
        lessonLimit: null,
      },
      {
        name: "Professional",
        slug: "pro",
        price: 29,
        courseLimit: null,
        chapterLimit: null,
        lessonLimit: null,
      },
    ]);
    console.log("📦 Default licenses seeded");
  }

  app.listen(PORT, () => {
    console.log(`🚀 Learningoo backend started on http://localhost:${PORT}`);
  });
})();
