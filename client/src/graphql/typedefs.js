import gql from "graphql-tag";

export default gql`
  extend type Query {
    getTrackers: [Tracker]
  }

  extend type Tracker {
    id: ID!
    task: Task
    originalTime: String
  }

  extend type Task {
    id: ID!
    name: String
    userTaskInfo: UserTaskInfo
    createdAt: String
    updatedAt: String
  }

  extend type UserTaskInfo {
    id: ID!
    description: String
    isPublic: Boolean
    isArchived: Boolean
    createdAt: String
    updatedAt: String
  }

  extend type Mutation {
    addTracker(id: ID!): Tracker
  }
`;
