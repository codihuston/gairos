import { mockResponses } from ".";
import DataSource from "../datasource";

const api = new DataSource.Class();

describe("google calendar unit tests", function() {
  beforeAll(function() {
    api.list = jest.fn().mockReturnValue(mockResponses.list.reduced);
    api.createMyCalendar = jest
      .fn()
      .mockReturnValue(mockResponses.createMyCalendar.reduced);
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

  it("createMyCalendar_requiredInput_returnsArray", async function() {
    expect(
      api.createMyCalendar({
        summary: "test calendar",
        description: "some description"
      })
    ).toEqual(mockResponses.createMyCalendar.reduced);
    expect(api.createMyCalendar).toHaveBeenCalled();
  });
});
