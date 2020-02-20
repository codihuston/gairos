import React from "react";

import { APP_NAME } from "../../config";

export default function Home() {
  return (
    <div>
      <h2>About {APP_NAME}</h2>
      <h3>What does it do?</h3>
      <p>
        {APP_NAME} is designed to enable you to track your daily tasks in a
        simple manner. On top of that, your tasks will be automagically synced
        to your Google Calendar! We will also provide you with reports so that
        you can see what you are spending your time on, so that you can manage
        your time better.
      </p>
      <h3>Why use it?</h3>
      <p>
        If statistics is your thing, if you just want to get better at managing
        your time, or if you just want to be able to "see" what you have up to
        from a birds-eye view, then this app is for you!
      </p>
      <h2>About the Developer</h2>
      <p>
        This is a project was developed by Codi Huston. The name "{APP_NAME}" is
        the name of the project itself; the finalized name of this app has not
        yet been determined. You can follow the progress of this app{" "}
        <a href="http://github.com/codihuston/gairos/">in the repo</a>! Feel
        free to drop any suggestions there as well =). You are also welcome to{" "}
        <a href="https://twitter.com/codingwithcodi">tweet at me!</a>
      </p>
    </div>
  );
}
