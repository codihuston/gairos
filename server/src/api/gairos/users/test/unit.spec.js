import { assert } from "chai";

describe("user unit tests", function() {
  it("example", async function(done) {
    const log = this.initTestLog();
    log("Example log in test file");
    assert(true);
    done();
  });
});
