import express from "express";
import { oauth2Client, url } from "../services/auth/google";
import { calendar } from "../api/google";

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
router.get("/google/cb", async function(req, res) {
  // TODO: handle errors
  const { code } = req.query;

  const { tokens } = await oauth2Client.getToken(code);

  oauth2Client.setCredentials(tokens);

  // if no errors, init a session
  req.session.isAuthenticated = true;
  req.session.tokens = tokens;

  console.log("session", req.session);

  // test getting calendars
  res.json({
    calendars: await calendar.calendarList.list()
  });
});

export { router };
