import { assert } from "chai";

describe("user integration tests", function() {
  it("creates a user", async function(done) {
    const log = this.initTestLog();
    log("Example log in test file");
    assert(true);
    done();
  });
});
