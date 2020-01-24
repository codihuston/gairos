import { createError } from "apollo-errors";
import { ApolloError } from "apollo-server-express";

export const ForbiddenError = createError("ForbiddenError", {
  message: "You are forbidden to do this operation."
});

export const CustomApolloError = (message, code, additionalProperties) =>
  new ApolloError(message, code, additionalProperties);

export const UnauthenticatedError = createError("UnauthenticatedError", {
  message: "You must log in to do that."
});
export const UserAlreadyExistsError = createError("UserAlreadyExistsError", {
  message: "User already exists!"
});
