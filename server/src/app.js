import { createError as apolloError } from "apollo-errors";
import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import session from "express-session";
import uuid from "uuid/v4";

const { ApolloServer, gql } = require("apollo-server-express");

import { router as indexRouter } from "./routes/index";
import { router as usersRouter } from "./routes/users";
import { router as authRouter } from "./routes/auth";
import { calendar_v3 } from "googleapis";
import { oauth2Client, url } from "./services/auth/google";
const calender = new calendar_v3.Calendar({
  auth: oauth2Client
});

var app = express();

// init session
app.use(
  session({
    // generate unique ids for sessions
    genid: function(req) {
      return uuid();
    },
    name: `${process.env.APP_NAME}.${process.env.NODE_ENV}`,
    secret: "qwe qwe",
    resave: false,
    saveUninitialized: true,
    // store: ??? // TODO: implement a persistent datastore for sessions
    // TODO: enable secure cookies in prod
    cookie: { secure: false }
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);

// init graphql
// TODO: configure graphql typedefs and resolvers!
const typeDefs = gql`
  type Query {
    hello: String
    getCalendars: [Calendar]
  }

  type Calendar {
    id: String
    summary: String
    description: String
  }
`;

const resolvers = {
  Query: {
    // get access to context
    hello: (parent, args, context, info) => {
      const { session } = context;

      console.log("Session in resolvers:", context.session);

      // Handle unauthorized requests
      // TODO: move into its own /errors file?
      const isAuthenticated = session.isAuthenticated || false;
      const hasAccessToken =
        (session.tokens && session.tokens.access_token) || false;

      const UnauthenticatedError = apolloError("UnauthenticatedError", {
        message: "You must log in to do that."
      });

      if (!isAuthenticated || !hasAccessToken) {
        throw new UnauthenticatedError();
      }

      return "Hello world!";
    },
    getCalendars: async (parent, args, context, info) => {
      const { session } = context;

      // TODO: handle bad response?
      const res = await calender.calendarList.list();

      return res.data.items;
    }
  }
};

// inject graphql server into express
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    // pass context into our resolvers
    return {
      session: req.session
    };
  }
});
server.applyMiddleware({ app });

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
  res.json(err);
});

export default app;
