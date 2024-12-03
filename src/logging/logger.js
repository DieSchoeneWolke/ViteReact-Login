import log4js from "log4js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "../backend/middleware/dotenv.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDir = path.join(__dirname, "./src/logging/logs");

try {
  fs.mkdirSync(logDir, { recursive: true });
} catch (e) {
  if (e.code !== "EEXIST") {
    console.error("Could not set up log directory, error was: ", e);
    process.exit(1);
  }
}

const logConfig = {
  appenders: {
    access: {
      type: "dateFile",
      filename: "./src/logging/logs/access/access.log",
      layout: {
        type: "pattern",
        pattern: "%d{ISO8601} [%p] %c - %m%n",
      },
      numBackups: 30,
      category: "http",
    },
    app: {
      type: "file",
      filename: "./src/logging/logs/app/app.log",
      layout: {
        type: "pattern",
        pattern: "%d{ISO8601} [%p] %c - %m%n",
      },
      numBackups: 30,
    },
    errorFile: {
      type: "file",
      filename: "./src/logging/logs/error/error.log",
      layout: {
        type: "pattern",
        pattern: "%d{ISO8601} [%p] %c - %m%n",
      },
      numBackups: 30,
    },
    errors: {
      type: "logLevelFilter",
      level: "ERROR",
      appender: "errorFile",
    },
  },
  categories: {
    default: { appenders: ["app", "errors"], level: "INFO" },
    debug: { appenders: ["app", "errors"], level: "DEBUG" },
    auth: { appenders: ["app", "errors"], level: process.env.LOG_LEVEL },
    database: { appenders: ["app", "errors"], level: process.env.LOG_LEVEL },
    server: { appenders: ["app", "errors"], level: process.env.LOG_LEVEL },
  },
};

log4js.configure(logConfig);

const defaultLogger = log4js.getLogger();
const debugLogger = log4js.getLogger("debug");
const authLogger = log4js.getLogger("auth");
const databaseLogger = log4js.getLogger("database");
const serverLogger = log4js.getLogger("server");

export { defaultLogger, debugLogger, authLogger, databaseLogger, serverLogger };
