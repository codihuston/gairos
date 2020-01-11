#!/usr/bin/env node

/**
 * Module dependencies.
 */

import config from "../config";
import app from "../app";
import debugLib from "debug";
import http from "http";
import { resolve } from "path";
import { exec } from "child_process";
import { sequelize } from "../api/gairos";

const debug = debugLib("server:www");
const port = normalizePort(process.env.APP_PORT || "3000");
let server = null;

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("Listening on " + bind);
}

(async function init() {
  try {
    const appInstance = await app;
    /**
     * Get port from environment and store in Express.
     */
    appInstance.set("port", port);
    /**
     * Create HTTP server.
     */

    server = http.createServer(appInstance);

    /**
     * For developer experience, if this option is on, the database will be
     * re-built on every build EXCEPT FOR when the environment is PRODUCTION!
     *
     * If the database is wiped, seeders will also be ran.
     */
    const eraseDatabaseOnSync =
      process.env.DB_SYNC_WITH_SEQUELIZE.toLowerCase() == "true" &&
      !process.env.NODE_ENV.toLowerCase().includes("prod");

    console.log("Please wait while connecting to the database...");
    console.log("Sequelize sync option is set to", eraseDatabaseOnSync);

    await sequelize.sync({
      force: eraseDatabaseOnSync
    });

    // execute seeders if the database was emptied
    if (
      eraseDatabaseOnSync &&
      !process.env.NODE_ENV.toLowerCase().includes("prod")
    ) {
      console.log("Please wait while executing database seeders *ASYNC*...");
      exec(
        "yarn run db:seed:dev",
        {
          cwd: resolve(__dirname, "..", "..") // server root
        },
        (err, stdout, stderr) => {
          if (err) {
            console.error(err);
          } else {
            // the *entire* stdout and stderr (buffered)
            console.log("Finished executing seeders! See output below:");
            debug(`seeder:stderr: ${stderr}`);
            debug(`seeder:stdout: ${stdout}`);
          }
        }
      );
    }

    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(port);
    server.on("error", onError);
    server.on("listening", onListening);
  } catch (e) {
    console.error("FATAL: Failed at building the server", e);
    process.exit(1);
  }
})();
