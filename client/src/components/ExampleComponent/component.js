import React from "react";

export const doIncrement = prevState => ({
  counter: prevState.counter + 1
});
export const doDecrement = prevState => ({
  counter: prevState.counter - 1
});

class ExampleComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      counter: 0
    };
  }

  increment = () => {
    this.setState(doIncrement);
  };

  decrement = () => {
    this.setState(doDecrement);
  };

  render() {
    return (
      <div>
        <div>Example Component</div>
        <button type="button" onClick={this.increment}>
          Increment
        </button>
        {this.state.counter}
        <button type="button" onClick={this.decrement}>
          Decrement
        </button>
      </div>
    );
  }
}

export default ExampleComponent;
