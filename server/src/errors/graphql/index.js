import { ApolloError } from "apollo-server-express";

export const CustomApolloError = (message, code, additionalProperties) =>
  new ApolloError(message, code, additionalProperties);

export const UnauthenticatedError = new ApolloError(
  "You must be logged in.",
  401
);
export const UnauthorizedError = new ApolloError(
  "You are not authorized to execute this operation.",
  401
);
