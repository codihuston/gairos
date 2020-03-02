import { config } from "dotenv";
import { resolve } from "path";
import { existsSync } from "fs";

const root = resolve(__dirname);
let path = "";
let loaded = false;
let shouldExit = true;

console.log("Current node environment:" + process.env.NODE_ENV);

switch (process.env.NODE_ENV.toLowerCase()) {
  case "production":
    shouldExit = false;
    path = resolve(root, ".env");
    break;
  case "ci":
    shouldExit = false;
    path = resolve(root, ".env-ci");
    break;
  case "test":
    path = resolve(root, ".env-test");
    break;
  default:
    path = resolve(root, ".env-development");
    break;
}

if (loaded) {
  // no-op. already loaded
}

// load the appropriate .env file
else if (!existsSync(path)) {
  console.error(
    "WARNING: Configuration does not exist for this environment at:",
    path,
    ". Please see the documentation regarding the '.env' file!",
    "You may ignore this if this is intentional (CI/CD pipeline, production)"
  );

  if (shouldExit) {
    console.error(
      "Force existing, as the corresponding .env file must exist for this environment!"
    );
    process.exit(1);
  }
} else {
  config({ path: path });
  loaded = true;
  console.log("Configuration loaded from:", path);
}
