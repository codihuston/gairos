import { CustomApolloError, GenericApolloError } from "../graphql";

export default function({ error, matches, message }) {
  console.error(error);

  if (error.errors) {
    for (const e of error.errors) {
      // if given a error condition to match and a message
      if (
        e.type.includes(matches) ||
        (e.message.includes(matches) && message)
      ) {
        // throw a generic error with a custom message
        throw CustomApolloError(message, 422, error);
      }
      // otherwise throw the error as provided by sequelize
      else {
        throw CustomApolloError(`${e.type}: ${e.message}`, 422, error);
      }
    }
  } else {
    throw error;
  }
}
