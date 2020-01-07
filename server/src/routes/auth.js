import express from "express";
import passport from "passport";
import axios from "axios";
const router = express.Router();

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get(
  "/google",
  passport.authenticate("google", {
    session: false, // does not prevent serializing error (described in app)
    scope: [
      "https://www.googleapis.com/auth/calendar",
      // required in order to prevent "invalid credentials" error
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile"
    ],
    // get refresh token
    accessType: "offline"
  })
);

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get(
  "/google/cb",
  // TODO: handle failure
  passport.authenticate("google", { failureRedirect: "/login" }),
  async function(req, res) {
    // TODO: on successful login, return the JWT to the client side!
    console.log("TODO: return token to client", req.user.token);

    /**
     * You can use the token when sending an HTTP request to the WebAPI as
     * described in either of the following documentation:
     * - https://developers.google.com/oauthplayground/?code=4/vAHXVpAMob_uSs3PFJY0AA28VkLgxhg2u34IBf9ypQfmB3xXwUiPhEaf8NSMHOCWWHm-IeFX-WFhLtwFED2Vbz8&scope=https://www.googleapis.com/auth/calendar%20https://www.googleapis.com/auth/calendar.events
     * - https://developers.google.com/calendar/v3/reference
     */
    try {
      const headers = { Authorization: `Bearer ${req.user.token}` };
      const response = await axios.get(
        "https://www.googleapis.com/calendar/v3/users/me/calendarList",
        {
          headers
        }
      );
      console.log("The response", response.data);
      res.json(response.data);
    } catch (e) {
      res.json(e);
    }
  }
);

export { router };
