import { createError } from "apollo-errors";

export default {
  Query: {
    me: async (parent, args, context, info) => {
      // TODO: handle bad response?
      return context.models.user.findByPk(1);
    }
  }
};
