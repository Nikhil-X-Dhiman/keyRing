import { v4 as uuidv4 } from "uuid";
import path from "path";
import { existsSync } from "fs";
import { appendFile, mkdir } from "fs/promises";

export const logEvents = async (message, logName) => {
  const logTime = new Date().toUTCString();
  const logRecord = `${logTime}\t${uuidv4()}\t${message}\n}`;

  try {
    if (!existsSync(path.join(__dirname, "..", "logs"))) {
      await mkdir(path.join(__dirname, "..", "logs"));
    }
    await appendFile(path.join(__dirname, "..", "logs", logName), logRecord);
  } catch (err) {
    console.error(err);
  }
};

export const reqLogging = (req, res, next) => {
  logEvents(`${req.method} ${req.path}`, "requestLogs.txt");
  next();
};

export const errLogging = (err) => {
  logEvents(err, "errorLogs.txt");
};
