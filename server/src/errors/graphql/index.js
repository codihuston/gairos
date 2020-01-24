import { ApolloError } from "apollo-server-express";

export const CustomApolloError = (message, code, additionalProperties) =>
  new ApolloError(message, code, additionalProperties);

export const UniqueViolationError = (
  message = "Resource already exists!",
  additionalProperties = {}
) => new ApolloError(message, 422, additionalProperties);

export const UnauthenticatedError = new ApolloError(
  "You must be logged in.",
  401
);
