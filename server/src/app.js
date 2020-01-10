import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import session from "express-session";
import uuid from "uuid/v4";

const { ApolloServer } = require("apollo-server-express");

import { router as indexRouter } from "./routes/index";
import { router as usersRouter } from "./routes/users";
import { router as authRouter } from "./routes/auth";
import { models } from "./api/gairos";
import { compileGraphql } from "./api/gairos";

export default compileGraphql()
  .then(result => {
    console.log("GOT RESULT 1", result);
    const { typeDefs, resolvers } = result;
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

    // inject graphql server into express
    console.log("WHAT IS SCHEMA", typeDefs);
    console.log("WHAT IS RESOLVERS", resolvers);
    console.log("WHAT IS MODELS", models);
    const server = new ApolloServer({
      typeDefs: typeDefs,
      resolvers: resolvers,
      context: async ({ req, res }) => {
        // pass context into our resolvers
        return {
          models,
          session: req.session,
          me: models.user.findByLogin("rwieruch")
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

    return app;
  })
  .catch(e => {
    console.error("APP FAILED TO COMPILE", e);
  });
