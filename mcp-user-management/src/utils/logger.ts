import config from "../config/index.js";

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private level: LogLevel;

  constructor() {
    this.level = this.getLogLevel();
  }

  private getLogLevel(): LogLevel {
    switch (config.LOG_LEVEL) {
      case "debug":
        return LogLevel.DEBUG;
      case "info":
        return LogLevel.INFO;
      case "warn":
        return LogLevel.WARN;
      case "error":
        return LogLevel.ERROR;
      default:
        return LogLevel.INFO;
    }
  }

  private formatMessage(
    level: string,
    message: string,
    data?: unknown
  ): string {
    const timestamp = new Date().toISOString();
    const baseMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    if (config.LOG_FORMAT === "json") {
      return JSON.stringify({
        timestamp,
        level: level.toUpperCase(),
        message,
        data,
      });
    }

    if (data) {
      return `${baseMessage} ${JSON.stringify(data)}`;
    }

    return baseMessage;
  }

  debug(message: string, data?: unknown): void {
    if (this.level <= LogLevel.DEBUG) {
      console.error(this.formatMessage("debug", message, data));
    }
  }

  info(message: string, data?: unknown): void {
    if (this.level <= LogLevel.INFO) {
      console.error(this.formatMessage("info", message, data));
    }
  }

  warn(message: string, data?: unknown): void {
    if (this.level <= LogLevel.WARN) {
      console.error(this.formatMessage("warn", message, data));
    }
  }

  error(message: string, data?: unknown): void {
    if (this.level <= LogLevel.ERROR) {
      console.error(this.formatMessage("error", message, data));
    }
  }
}

export const logger = new Logger();
