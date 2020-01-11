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
import DatabaseConnector from "../db";

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
     * Connect to the database.
     */
    await DatabaseConnector();

    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(port);
    server.on("error", onError);
    server.on("listening", onListening);
  } catch (e) {
    console.error("FATAL: Failed building the server", e);
    process.exit(1);
  }
})();
