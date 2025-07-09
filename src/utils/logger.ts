// Centralized logging utility - replaces direct console.log usage
// This allows us to control logging levels and easily disable in production

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

class Logger {
  private level: LogLevel = LogLevel.DEBUG;

  setLevel(level: LogLevel) {
    this.level = level;
  }

  error(message: string, ...args: any[]) {
    if (this.level >= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]) {
    if (this.level >= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]) {
    if (this.level >= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  debug(message: string, ...args: any[]) {
    if (this.level >= LogLevel.DEBUG) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }

  // Helper methods for common logging patterns
  action(action: string, data?: any) {
    this.debug(`Action: ${action}`, data);
  }

  apiCall(endpoint: string, method: string = 'GET', data?: any) {
    this.debug(`API ${method}: ${endpoint}`, data);
  }

  componentMount(componentName: string) {
    this.debug(`Component mounted: ${componentName}`);
  }

  componentUnmount(componentName: string) {
    this.debug(`Component unmounted: ${componentName}`);
  }
}

export const logger = new Logger();

// In production, set to ERROR level
if (import.meta.env.PROD) {
  logger.setLevel(LogLevel.ERROR);
}