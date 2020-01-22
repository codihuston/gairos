import { mockResponses } from ".";
import DataSource from "../datasource";
import { models } from "../../../../db";

const api = new DataSource.Class({ models });

describe("user unit tests", function() {
  it("should reduce userTaskHistory", async function(done) {
    const spy = jest.spyOn(api, "reduceTaskHistory");
    expect(
      api.reduceTaskHistory(mockResponses.reduceTaskHistory.input)
    ).toEqual(mockResponses.reduceTaskHistory.output);
    expect(spy).toHaveBeenCalledTimes(1);
    done();
  });
});
