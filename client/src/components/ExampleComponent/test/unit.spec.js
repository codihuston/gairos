import ExampleComponent, { doIncrement, doDecrement } from "../component";
import React from "react";
import { shallow } from "enzyme";

describe("test", function() {
  it("should increment", function() {
    const state = {
      counter: 0
    };
    const newState = doIncrement(state);
    expect(newState.counter).toBe(1);
  });
  it("should decrement", function() {
    const state = {
      counter: 0
    };
    const newState = doDecrement(state);
    expect(newState.counter).toBe(-1);
  });

  it("renders without crashing", () => {
    const wrapper = shallow(<ExampleComponent />);
    expect(wrapper).toContainReact(<div>Example Component</div>);
  });
});
