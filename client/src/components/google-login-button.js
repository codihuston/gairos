import React from "react";
import GoogleSignin from "../assets/img/google/btn_google_dark_normal_ios.svg";
import { getApiAuthUrl } from "../config";

class GoogleSignInButton extends React.Component {
  render() {
    return (
      // variablize href
      <a className="btn-google" href={getApiAuthUrl()}>
        <div className="btn-google__content">
          <img src={GoogleSignin} alt="Google Sign In Button"></img>
          <span>Sign in with Google</span>
        </div>
      </a>
    );
  }
}

export default GoogleSignInButton;
