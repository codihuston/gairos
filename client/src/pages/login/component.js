import React from "react";
import GoogleSignInButton from "../../components/google-login-button";

import { APP_NAME } from "../../config";

export default function Login() {
  // TODO: style this landing page!
  return (
    <div>
      <div
        className="m-auto text-center"
        style={{
          width: "50vh",
        }}
      >
        <h1 className="text-center">Welcome to {APP_NAME}!</h1>
        <p className="text-center">
          Please sign in with your google account below!
        </p>
        <div className="m-auto">
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
}
