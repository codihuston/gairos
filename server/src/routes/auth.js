import express from "express";
import passport from "passport";

const router = express.Router();

/* GET users listing. */
router.get(
  "/google",
  passport.authenticate("google", {
    session: false, // does not prevent serializing error (described in app)
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/calendar"
    ]
  })
);

router.get(
  "/google/cb",
  // TODO: handle failure
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    // TODO: on successful login, return the JWT to the client side!
    res.redirect("/");
  }
);

export { router };
