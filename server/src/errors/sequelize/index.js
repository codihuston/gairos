import GraphqlErrors from "../graphql";

export default function(error) {
  // TODO: conditionally return a graphql custom error related to the issue?
  console.error(error);
  if (error.errors) {
    for (const e of error.errors) {
      throw new GraphqlErrors.GenericSequelizeError({
        message: `${e.type}: ${e.message}`
      });
    }
  } else {
    throw error;
  }
}
