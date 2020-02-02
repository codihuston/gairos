import { ApolloError } from "apollo-server-express";
import { CustomApolloError } from "../graphql";

/**
 * Intended to be used to handle an error that may be thrown by sequelize. If
 * the given options[X].matches matches one of the given errors, and the given
 * options[X].errorToThrow is an ApolloError, or a function that returns
 * an ApolloError, they are thrown.
 *
 * Otherwise, a default customized ApolloError is thrown with a code of
 * 422, accessible in a client via `errors.extensions.code`
 *
 * NOTE: if a client gets a GraphQL errors response, it is technically a
 * HTTP 200 response code since the GraphQL server could process the request
 * (regardless of error); the specified code in ApolloError does NOT set the
 * HTTP code, and the client is responsible for processing the GraphQL errors
 * it receives, so try to be consistent.
 *
 * @param [{*}] array of options objects
 * options[X].error: object, a javascript error
 * options[X].matches: string, a string ran against the errors.errors.type|.message (if any)
 * options[X].message: string, if options[X].matches is found in the nested errors,
 *  this is passed as an argument into errorToThrow() (if it is a function)
 * options[X].errorToThrow: ApolloError|Function (that returns an Apollo Error)
 */
export default function(error, potentialErrors = []) {
  console.error(error);

  if (error.errors) {
    for (const e of error.errors) {
      for (const potentialError of potentialErrors) {
        const { matches, message, errorToThrow } = potentialError;
        const isErrorToThrowAFunction = typeof errorToThrow === "function";
        const isErrorToThrowAnApolloError =
          potentialError instanceof ApolloError;

        // if given a error condition to match and a message
        if (
          e.type.includes(matches) ||
          (e.message.includes(matches) && message)
        ) {
          if (isErrorToThrowAFunction) {
            // throw the given errorToThrow
            throw errorToThrow(message, error);
          }
        }
        // if it is a plain ApolloError, just throw it
        else if (isErrorToThrowAnApolloError) {
          throw potentialError;
        }
      }
    }
  }
  // otherwise throw the error as provided by sequelize
  throw CustomApolloError(`${error.message}`, 422, error);
}

const errorToThrow = (message, additionalProperties) =>
  new ApolloError(message, 422, additionalProperties);

export const UniqueViolationError = (message = "Resource already exists!") => {
  return {
    matches: "unique violation",
    message,
    errorToThrow
  };
};
