import { UnauthenticatedError } from "../../errors/graphql";
import { skip } from "graphql-resolvers";

export const isAuthenticated = (parent, args, { me, session }) => {
  if (!me || !session.isAuthenticated) {
    throw UnauthenticatedError;
  }
  return skip;
};
