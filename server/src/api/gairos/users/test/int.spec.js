import DatabaseConnector from "../../../../db";

describe("user integration tests", function() {
  beforeAll(async () => {
    await DatabaseConnector();
  });

  it("creates a user", function() {
    expect(true);
  });
});
