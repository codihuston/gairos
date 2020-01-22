import { ForbiddenError } from "apollo-server-express";
import { skip } from "graphql-resolvers";

export const isAuthenticated = (parent, args, { me }) => {
  if (!me) {
    throw new ForbiddenError("You must be logged in.");
  }
  return skip;
};
