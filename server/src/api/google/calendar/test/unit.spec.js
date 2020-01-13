import { assert } from "chai";
import sinon from "sinon";
import mockResponses from ".";
import DataSource from "../datasource";

const api = new DataSource.Class();

describe("google calendar unit tests", function() {
  it("reducer_validInput_true", async function() {
    const log = this.initTestLog();
    sinon.stub(api, "list").returns(mockResponses.list.reduced);

    return assert.deepEqual(
      api.reducer(mockResponses.list.raw),
      mockResponses.list.reduced,
      "api response is reduced correctly"
    );
  });
});
