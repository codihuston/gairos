import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import passport from "passport";
import googleStrategy from "./services/auth/strategies/google";

const { ApolloServer, gql } = require("apollo-server-express");

import { router as indexRouter } from "./routes/index";
import { router as usersRouter } from "./routes/users";
import { router as authRouter } from "./routes/auth";

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
// app.use(passport.session()); // not implemented

// required to prevent err: "failed to serialize user into session"
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// TODO: configure graphql typedefs and resolvers!
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello world!"
  }
};

// inject graphql server into express
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

// routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
