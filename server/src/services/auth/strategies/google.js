var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    function(token, tokenSecret, profile, done) {
      console.log(token, tokenSecret, profile, done);
      return done(null, { data: "COMPLETED!" });
    }
  )
);
