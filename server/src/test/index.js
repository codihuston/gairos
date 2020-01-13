import DatabaseConnector from "../db";
import debugLib from "debug";

before(function() {
  return DatabaseConnector();
});

beforeEach(function(done) {
  /**
   * prefix for debug() logger;
   *
   * NOTE: env DEBUG= in package.json must match in order to see log output
   * printed to the console!
   */
  this.prefix = "test";

  /**
   * Returns a debug() logger instance. Intended to make
   * searching test results easier.
   *
   * Example usage: in an it() test block, use:
   *  it("creates a user", async function(done) {
   *    const log = this.initTestLog();
   *    log("Example log in test file");
   *    assert(true);
   *    done();
   *  });
   *
   *  When running tests the following will be printed to the console:
   *  test:user integration tests:creates a user Example log in test file
   */
  this.initTestLog = function() {
    const log = debugLib(
      ["test", this.test.parent.title, this.test.title].join(":")
    );
    log("Starting test");
    return log;
  };

  done();
});
