import express from "express";
import debugLib from "debug";

import { oauth2Client, getAuthUrl } from "../services/auth/google";
import { GooglePeople, GoogleCalendar } from "../api";
import { models } from "../api";

const debug = debugLib("server:routes/auth");
const router = express.Router();

/**
 *  GET /auth/google
 */
router.get("/google", function(req, res) {
  debug("QQQ set state", req.session.id, req.connection.remoteAddress);
  const url = getAuthUrl({ state: req.session.id });
  debug(oauth2Client, url);
  res.redirect(url);
});

/**
 *  GET /auth/google/callback
 */
router.get("/google/cb", async function(req, response, next) {
  try {
    // TODO: handle errors
    const { code, state } = req.query;

    const { tokens, res } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    // TODO: use state to restore client session (if needed) and prevent CSRF
    debug("got state back", state);
    debug("session before set", req.session, req.session.id);

    const people = await GooglePeople.people.get({
      resourceName: "people/me",
      personFields: ["names", "emailAddresses"]
    });

    // create the user if they do not exist
    const user = await models.user.createFromGoogleProfile(people.data);

    // if no errors, init a session
    debug("store user in session", user);
    req.session.isAuthenticated = true;
    req.session.tokens = tokens;
    req.session.user = user;

    // test getting calendars
    debug({
      people,
      calendars: await GoogleCalendar.calendarList.list()
    });

    debug("session after set", req.session);

    // now redirect to the front-end login uri, where it will
    // send a query to the graphql endpoint; if it succeeds, so too, should
    // the login on the client side
    response.redirect(
      `${process.env.APP_CLIENT_HTTP_SCHEME}://${process.env.APP_CLIENT_HOST}:${process.env.APP_CLIENT_PORT}/${process.env.APP_CLIENT_LOGIN_URI}`
    );
  } catch (e) {
    next(e);
  }
});

export { router };
