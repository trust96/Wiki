import { createLogger, format, transports } from "winston";
const myFormat = format.printf(({ level, message, label, timestamp, stack }) => {
  return `[${timestamp}] ${level}: ${message} ${stack}`;
});

const logger = createLogger({
  level: "http",
  format: format.combine(format.timestamp(), myFormat, format.json(), format.errors({ stack: true })),
  defaultMeta: { service: "user-service" },
  transports: [
    new transports.Console({
      format: format.combine(format.cli(), format.timestamp(), myFormat, format.errors({ stack: true })),
    }),
    new transports.File({ filename: "log/error.log", level: "error" }),
    new transports.File({ filename: "log/combined.log" }),
  ],
});

export default logger;
