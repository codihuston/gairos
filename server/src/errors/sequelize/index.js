import { ApolloError } from "apollo-server-express";
import { CustomApolloError } from "../graphql";

/**
 * Intended to be used to handle an error that may be thrown by sequelize. If
 * the given options.matches matches one of the given errors, and the given
 * options.errorToThrow is an ApolloError, or a function that returns
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
 * @param {*} options object
 * options.error: object, a javascript error
 * options.matches: string, a string ran against the errors.errors.type|.message (if any)
 * options.message: string, if options.matches is found in the nested errors,
 *  this is passed as an argument into errorToThrow() (if it is a function)
 * options.errorToThrow: ApolloError|Function (that returns an Apollo Error)
 */
export default function(error, { matches, message, errorToThrow }) {
  const isErrorToThrowAFunction = typeof errorToThrow === "function";
  const isErrorToThrowAnApolloError = errorToThrow instanceof ApolloError;

  if (error.errors) {
    for (const e of error.errors) {
      // if given a error condition to match and a message
      if (
        e.type.includes(matches) ||
        (e.message.includes(matches) && message)
      ) {
        if (isErrorToThrowAFunction) {
          // throw the given errorToThrow
          throw errorToThrow(message, error);
        } else if (isErrorToThrowAnApolloError) {
          // if it is a plain ApolloError, just throw it
          throw errorToThrow;
        }
      }
    }
  }
  // otherwise throw the error as provided by sequelize
  throw CustomApolloError(`Sequelize Error: ${error.message}`, 422, error);
}
