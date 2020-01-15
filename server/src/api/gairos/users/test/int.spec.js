import DatabaseConnector from "../../../../db";

describe("user integration tests", function() {
  beforeAll(async done => {
    await DatabaseConnector();
    done();
  });

  it("creates a user", async function(done) {
    expect(true);
    done();
  });
});
