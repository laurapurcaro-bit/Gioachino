const dotenv = require("dotenv").config();
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const passport = require("passport");
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = require("./schemas/user");

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);
// used to serialize the user for the session
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      // Find or create googleId
      User.findOne({ googleId: profile.id }, function (err, user) {
        if (err) {
          return done(err);
        }
        // No user was found... so create a new user with values from Google (all the profile. stuff)
        if (!user) {
          console.log("no user found, creating one");
          user = new User({
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            photo: profile.photos[0]?.value,
            provider: profile.provider,
            googleId: profile.id,
          });
          console.log(user);
          user.save(function (err) {
            if (err) console.log(err);
            return done(err, user);
          });
        } else {
          //found user. Return
          console.log("user is: " + user);
          return done(err, user);
        }
      });
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/facebook/callback",
      profileFields: [
        "id",
        "displayName",
        "photos",
        "emails",
        "name",
        "gender",
      ],
    },
    function (accessToken, refreshToken, profile, done) {
      // Find or create googleId
      User.findOne({ facebookId: profile.id }, function (err, user) {
        // console.log(profile);
        if (err) {
          return done(err);
        }
        // No user was found... so create a new user with values from Google (all the profile. stuff)
        if (!user) {
          user = new User({
            displayName: profile?.displayName,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            email: profile.emails[0]?.value,
            photo: profile.photos[0]?.value,
            provider: profile.provider,
            facebookId: profile.id,
          });
          console.log(user);
          user.save(function (err) {
            if (err) console.log(err);
            return done(err, user);
          });
        } else {
          //found user. Return
          console.log("user is: " + user);
          return done(err, user);
        }
      });
    }
  )
);

const OAuthLinkedIn = new LinkedInStrategy(
  {
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/linkedin/callback",
    scope: ["r_emailaddress", "r_liteprofile"],
  },
  function (token, tokenSecret, profile, done) {
    console.log(profile);
    User.findOne({ linkedinId: profile.id }, function (err, user) {
      // console.log(profile);
      if (err) {
        return done(err);
      }
      // No user was found... so create a new user with values from Google (all the profile. stuff)
      if (!user) {
        user = new User({
          displayName: profile?.displayName,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          email: profile.emails[0]?.value,
          photo: profile.photos[0]?.value,
          provider: profile.provider,
          linkedinId: profile.id,
        });
        console.log(user);
        user.save(function (err) {
          if (err) console.log(err);
          return done(err, user);
        });
      } else {
        //found user. Return
        console.log("user is: " + user);
        return done(err, user);
      }
    });
  }
);
passport.use(OAuthLinkedIn);
