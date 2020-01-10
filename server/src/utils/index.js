// import config from "../config";
import { readdirSync } from "fs";
import { resolve } from "path";
import Debug from "debug";
import * as fs from "fs";
import { join } from "path";

// there should be a webpack loader for this: https://www.npmjs.com/package/graphql-tag
export const loadGQLFile = (fileDirectory, filePath) => {
  return fs.readFileSync(join(fileDirectory, filePath), "utf-8");
};

export const normalizePort = val => {
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
};

/**
 * Intended for use by individual test blocks (it blocks) in our specification
 * files. This will init a Debug() instance with consisting of:
 * - the test prefix (defined in /src/test/* init.js)
 * - and the name of the test suite (describe blocks)
 * - and the name of the individual test in which this function was invoked from
 *
 * The individual test should use this result to "log" the test output as
 * needed. This allows us to grainularly filter out test log output via the
 * DEBUG env variable.
 *
 * Important: in order to use this:
 * - the describe() and it() blocks must have
 * a callback function declared using the 'function' keyword, and not an arrow
 * function '() => {...}'
 * - in the test file, you must import this function and invoke .call(this)
 * on it
 */
export const initTestLog = function() {
  const log = Debug(
    [this.prefix, this.test.parent.title, this.test.title].join(":")
  );

  // add any additional config to this as needed
  log("Starting test...");

  return log;
};

/**
 * Returns a random int between min (inclusive) and max (exclusive)
 * @param {*} min
 * @param {*} max
 */
export const getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};
