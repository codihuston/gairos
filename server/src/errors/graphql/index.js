import { createError } from "apollo-errors";

export const ForbiddenError = createError("ForbiddenError", {
  message: "You are forbidden to do this operation."
});
export const GenericSequelizeError = createError("GenericSequelizeError", {
  message: "Something went wrong when interacting with the database."
});
export const UnauthenticatedError = createError("UnauthenticatedError", {
  message: "You must log in to do that."
});
export const UserAlreadyExistsError = createError("UserAlreadyExistsError", {
  message: "User already exists!"
});
