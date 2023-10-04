import winston from "winston";

winston.addColors({
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
});

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.colorize({
      all: true,
    }),
    winston.format.label({
      label: "[LOGGER]",
    }),
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.printf(
      ({ timestamp, message, level, label }) =>
        `${label} [${timestamp}] [${level}] ${message}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs.log" }),
  ],
});

export default logger;
