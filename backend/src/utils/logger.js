// Minimal dependency-free logger — no winston/pino in package.json, and this
// app's log volume doesn't justify adding one. Every level writes to
// stdout/stderr with a timestamp + level prefix so log lines are greppable
// and sortable, which bare console.log/console.error calls scattered across
// the codebase weren't.

const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };

// LOG_LEVEL lets a deployment quiet debug/info noise without code changes;
// defaults to "debug" everywhere except production, where debug logs are
// rarely useful and just add volume.
const configuredLevel = (process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug")).toLowerCase();
const threshold = LEVELS[configuredLevel] ?? LEVELS.debug;

function format(level, args) {
  const timestamp = new Date().toISOString();
  return [`[${timestamp}] [${level.toUpperCase()}]`, ...args];
}

function log(level, args) {
  if (LEVELS[level] < threshold) return;
  const line = format(level, args);
  if (level === "error" || level === "warn") {
    console.error(...line);
  } else {
    console.log(...line);
  }
}

export const logger = {
  debug: (...args) => log("debug", args),
  info: (...args) => log("info", args),
  warn: (...args) => log("warn", args),
  error: (...args) => log("error", args),
};

export default logger;
