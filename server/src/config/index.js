import { config, parse } from "dotenv";
import { resolve } from "path";
import { existsSync, readFileSync } from "fs";
import {
  isProductionEnvironment,
  isCiEnvironment,
  isDevelopmentEnvironment,
  isTestEnvironment,
} from "../utils";
import debugLib from "debug";

const debug = debugLib("server:config");
const root = resolve(__dirname + "/../../");
const exampleConfig = ".env-example";

let path = "";
let loaded = false;

function validateEnvironmentVariables() {
  let isValid = true;

  // add any required environment variables
  const defaultConfig = parse(readFileSync(resolve(root, exampleConfig)));
  const requiredKeys = Object.keys(defaultConfig || []);
  let warnings = [];
  let errors = [];

  for (var i = 0; i < requiredKeys.length; i++) {
    const k = requiredKeys[i];
    const v = defaultConfig[k];

    if (!isProductionEnvironment || !isCiEnvironment) {
      debug(`${k}=${v}`);
    }

    // if a key is defined in `.env-example`, but HAS NO value, it is OPTIONAL
    if (process.env && k && !v) {
      warnings.push(
        `WARNING: Optional environment variable '${k}' is not set!`
      );
    }
    // if a key is defined in `.env-example`, and HAS a value, it is REQUIRED
    else if (process.env && k && !process.env[k]) {
      errors.push(`FATAL: Required environment variable '${k}' is not set!`);
      isValid = false;
    }
  }

  warnings.map((w) => debug(w));
  errors.map((e) => console.error(e));

  return isValid;
}

if (isProductionEnvironment) {
  path = resolve(root, ".env");
} else if (isCiEnvironment) {
  path = resolve(root, ".env-ci");
} else if (isDevelopmentEnvironment) {
  path = resolve(root, ".env-development");
} else {
  path = resolve(root, ".env-test");
}

if (loaded) {
  // no-op. already loaded
}
// load the appropriate .env file
else if (!existsSync(path)) {
  debug(
    "WARNING: Configuration does not exist for this environment at:",
    path,
    ". Will assume environment variables are defined in context!"
  );
} else {
  config({ path: path });
  loaded = true;
  debug("Configuration loaded from:", path);
}

if (!validateEnvironmentVariables()) {
  console.error(
    "Cannot start server because required environment variables are missing.",
    "Check your environment variables!"
  );
  process.exit(1);
}
