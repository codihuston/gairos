import express from "express";
import passport from "passport";

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
  function(req, res) {
    // TODO: on successful login, return the JWT to the client side!
    console.log("TODO: return token to client", req.user.token);
    res.redirect("/");
  }
);

export { router };
