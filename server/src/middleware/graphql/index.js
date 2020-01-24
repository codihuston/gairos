import { skip } from "graphql-resolvers";

import { isDevelopmentEnvironment } from "../../utils";
import { UnauthenticatedError, UnauthorizedError } from "../../errors/graphql";

export const isAuthenticated = (parent, args, { me, session }) => {
  if (!me || !session.isAuthenticated) {
    throw UnauthenticatedError;
  }
  return skip;
};

export const isDeveloper = (parent, args, { me, session }) => {
  // TODO: refactor when roles are implemented
  if (isDevelopmentEnvironment) {
    return skip;
  }
  throw UnauthorizedError;
};

export const isGivenUser = (parent, { input }, { me, session }) => {
  // if given a user id
  if (input && input.userId) {
    // ensure it matches in session
    if (me.id === input.userId) {
      return skip;
    }
    // otherwise they are unauthorized
    else {
      throw UnauthorizedError;
    }
  }
  // otherwise, they did not give a userId
  else {
    return skip;
  }
};
