import { mockResponses } from ".";
import DataSource from "../datasource";
import { models } from "../../../../db";

const api = new DataSource.Class({ models });

describe("user unit tests", function() {
  it("should reduce userTasks into task", async function(done) {
    const spy = jest.spyOn(api, "reduceTasks");
    expect(api.reduceTasks(mockResponses.reduceTasks.input)).toEqual(
      mockResponses.reduceTasks.output
    );
    expect(spy).toHaveBeenCalledTimes(1);
    done();
  });
});
