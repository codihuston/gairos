// for express
import createError from "http-errors";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import session from "express-session";
import cors from "cors";
// for data store
import ConnectSessionStore from "connect-session-sequelize";
import { ApolloServer } from "apollo-server-express";

// other
import path from "path";
import uuid from "uuid/v4";
import debugLib from "debug";

import { defaultUsers as users } from "./test/utils";
import { router as indexRouter } from "./routes/index";
import { router as authRouter } from "./routes/auth";
import { resolveGraphqlDefinitions } from "./api";
import { sequelize, models } from "./db";
import { isProductionEnvironment, isDevelopmentEnvironment } from "./utils";

const debug = debugLib("server:app");
const SequelizeStore = ConnectSessionStore(session.Store);

// TODO: implement feat to persist these in storage (for scalability?)
const corsWhitelist = [
  `${process.env.APP_CLIENT_HTTP_SCHEME}://${process.env.APP_CLIENT_HOST}:${process.env.APP_CLIENT_PORT}`
];

export default resolveGraphqlDefinitions()
  .then(result => {
    const { typeDefs, resolvers, dataSources } = result;
    var app = express();

    app.use(
      cors({
        // TODO: configure for prod environment
        credentials: true,
        origin: corsWhitelist
      })
    );

    // init session
    app.use(
      session({
        // generate unique ids for sessions
        genid: function(req) {
          return uuid();
        },
        name: `${process.env.APP_NAME}.${process.env.NODE_ENV}`,
        secret: process.env.APP_SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        // TODO: use redis store for access token (to not persist them on disk)?
        store: new SequelizeStore({
          db: sequelize,
          table: "session"
        }),
        cookie: { secure: isProductionEnvironment }
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
    app.use("/auth", authRouter);

    // inject graphql server into express
    debug("GraphQL typeDefs:", typeDefs);
    debug("GraphQL resolvers:", resolvers);
    debug("GraphQL dataSources:", dataSources);
    const server = new ApolloServer({
      // enable debug for development environment only
      debug: isDevelopmentEnvironment,
      typeDefs,
      resolvers,
      dataSources,
      context: async ({ req, res }) => {
        let user = null;

        /**
         * If in development mode, and the user has not logged in
         * (hit /auth/google), auto-populate a seeded user into this
         * session.
         *
         * Note:
         *  - the defined user session below is overridden if you hit
         *  the /auth/google endpoint
         *  - that seeders are only ran if process.env.DB_SYNC_WITH_SEQUELIZE
         *  is set to true (default). It is recommended to set that environment
         *  variable to true at least once when setting up your dev environment
         */
        if (!isProductionEnvironment && !req.session.user) {
          user = await models.user.findOne({
            where: {
              id: users[0].id
            },
            raw: true
          });
          req.session.isAuthenticated = true;
        }
        // otherwise, confirm that the user in session exists
        else {
          user = await models.user.findOne({
            where: {
              id: req.session.user.id
            },
            raw: true
          });
        }

        // update the user
        req.session.user = user;

        debug("SESSION: ", req.session, req.session.id, req.headers);

        // pass context into our resolvers
        return {
          session: req.session,
          me: req.session.user ? req.session.user : null
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
      console.error(err);
      res.json({
        errors: [
          {
            message: err.message
          }
        ]
      });
    });

    return app;
  })
  .catch(e => {
    console.error("Failed to build the application:", e);
  });
