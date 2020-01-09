import { google } from "googleapis";

const scopes = [
  "https://www.googleapis.com/auth/calendar",
  // required in order to prevent "invalid credentials" error
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile"
];

export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

export const url = oauth2Client.generateAuthUrl({
  scope: scopes,
  // request access token
  access_type: "offline"
  /*force end-user to see the consent screen, even if they've auth'd before
  this is the only way to get a refresh token if access_type=offline was
  not set during that first auth.*/
  // prompt: "consent"
});

oauth2Client.on("tokens", tokens => {
  if (tokens.refresh_token) {
    console.log("TODO: Store refresh token in database", tokens.refresh_token);
  }

  console.log(
    "TODO: do we need to store this access token?",
    tokens.access_token
  );
});
