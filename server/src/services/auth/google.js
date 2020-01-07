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
  access_type: "offline",
  scope: scopes
});

oauth2Client.on("tokens", tokens => {
  if (tokens.refresh_token) {
    console.log("TODO: Store refresh token in database");
  }

  console.log(
    "TODO: do we need to store this access token?",
    tokens.access_token
  );
});
