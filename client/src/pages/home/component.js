import React from "react";
import { Jumbotron } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <Jumbotron>
        <h1>Welcome to Gairos!</h1>
        <p>
          Begin <Link to="/track">tracking your tasks</Link> now!
        </p>
      </Jumbotron>
      <p>
        In the near future, weekly reports on your progess will be displayed
        here =). For now, you can view them in{" "}
        <Link to="/reports">your reports section!</Link>
      </p>
    </div>
  );
}
