import express from "express";
import { oauth2Client, url } from "../services/auth/google";
import { GooglePeople, GoogleCalendar } from "../api";
import { models } from "../api";

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
router.get("/google/cb", async function(req, response, next) {
  try {
    // TODO: handle errors
    const { code } = req.query;

    const { tokens, res } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    console.log("session", req.session);

    const people = await GooglePeople.people.get({
      resourceName: "people/me",
      personFields: ["names", "emailAddresses"]
    });

    // create the user if they do not exist
    const user = await models.user.createFromGoogleProfile(people.data);

    // if no errors, init a session
    console.log("store user in session", user);
    req.session.isAuthenticated = true;
    req.session.tokens = tokens;
    req.session.user = user;

    // test getting calendars
    response.json({
      // TODO: store user info in session?
      people,
      calendars: await GoogleCalendar.calendarList.list()
    });
  } catch (e) {
    next(e);
  }
});

export { router };
