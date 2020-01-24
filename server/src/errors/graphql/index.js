import { ApolloError } from "apollo-server-express";

export const CustomApolloError = (message, code, additionalProperties) =>
  new ApolloError(message, code, additionalProperties);

export const UnauthenticatedError = new ApolloError(
  "You must be logged in.",
  401
);
