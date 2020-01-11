import { createError } from "apollo-errors";

export default {
  GenericSequelizeError: createError("GenericSequelizeError", {
    message: "Something went wrong when interacting with the database."
  }),
  UnauthenticatedError: createError("UnauthenticatedError", {
    message: "You must log in to do that."
  }),
  UserAlreadyExistsError: createError("UserAlreadyExistsError", {
    message: "User already exists!"
  })
};
