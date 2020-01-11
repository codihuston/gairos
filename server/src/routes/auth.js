import express from "express";
import { oauth2Client, url } from "../services/auth/google";
import { calendar, people } from "../api";

const router = express.Router();

/**
 *  GET /auth/google
 */
router.get("/google", function(req, res) {
  console.log(oauth2Client, url);
  res.redirect(url);
});

/**
 *  GET /auth/google/callback
 */
router.get("/google/cb", async function(req, response) {
  // TODO: handle errors
  const { code } = req.query;

  const { tokens, res } = await oauth2Client.getToken(code);

  oauth2Client.setCredentials(tokens);

  // if no errors, init a session
  req.session.isAuthenticated = true;
  req.session.tokens = tokens;

  console.log("session", req.session);

  // test getting calendars
  response.json({
    // TODO: store user info in session?
    people: await people.people.get({
      resourceName: "people/me",
      personFields: ["names", "emailAddresses"]
    }),
    calendars: await calendar.calendarList.list()
  });
});

export { router };
