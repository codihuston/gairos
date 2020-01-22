import { mockResponses } from ".";
import DataSource from "../datasource";
import { models } from "../../../../db";

const api = new DataSource.Class({ models });

describe("user unit tests", function() {
  it("should test a method on the user model", function() {
    expect(true);
  });
});
