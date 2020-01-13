import { assert } from "chai";
import sinon from "sinon";
import mockResponses from ".";
import DataSource from "../datasource";

const sandbox = sinon.createSandbox();

const api = new DataSource.Class();

describe("google calendar unit tests", function() {
  before(function() {
    sandbox.stub(api, "list").returns(mockResponses.list.reduced);
    sandbox.spy(api, "reducer");
  });

  after(function() {});

  it("reducer_validInput_returnsObject", async function() {
    assert.deepEqual(
      api.reducer(mockResponses.list.raw),
      mockResponses.list.reduced,
      "api response is reduced correctly"
    );
    sandbox.assert.calledOnce(api.reducer);
  });

  it("list_noInput_returnsArray", async function() {
    assert.deepEqual(
      api.list(),
      mockResponses.list.reduced,
      "api lists calendars"
    );
    sandbox.assert.calledOnce(api.list);
  });
});
