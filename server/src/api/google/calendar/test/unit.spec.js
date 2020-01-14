import sinon from "sinon";
import { mockResponses } from ".";
import DataSource from "../datasource";

const sandbox = sinon.createSandbox();

const api = new DataSource.Class();

describe("google calendar unit tests", function() {
  beforeAll(function() {
    api.list = jest.fn().mockReturnValue(mockResponses.list.reduced);
    api.createCalendar = jest
      .fn()
      .mockReturnValue(mockResponses.createCalendar.reduced);
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("reducer_validInput_returnsObject", async function() {
    const spy = jest.spyOn(api, "reducer");
    expect(api.reducer(mockResponses.list.raw)).toEqual(
      mockResponses.list.reduced
    );
    expect(spy).toHaveBeenCalled();
  });

  it("list_noInput_returnsArray", async function() {
    expect(await api.list()).toEqual(mockResponses.list.reduced);
    expect(api.list).toHaveBeenCalled();
  });

  it("createCalendar_requiredInput_returnsArray", async function() {
    expect(
      api.createCalendar({
        summary: "test calendar",
        description: "some description"
      })
    ).toEqual(mockResponses.createCalendar.reduced);
    expect(api.createCalendar).toHaveBeenCalled();
  });
});
