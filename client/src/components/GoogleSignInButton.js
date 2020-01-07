import React from "react";
import GoogleSignin from "../assets/img/google/btn_google_dark_normal_ios.svg";

class GoogleSignInButton extends React.Component {
  render() {
    return (
      // TODO: variablize href
      <a className="btn-google" href="http://localhost:8000/auth/google">
        <div className="btn-google__content">
          <img src={GoogleSignin}></img>
          <span>Sign in with Google</span>
        </div>
      </a>
    );
  }
}

export default GoogleSignInButton;
