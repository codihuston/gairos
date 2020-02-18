import gql from "graphql-tag";

export default gql`
  extend type Query {
    getTrackers: [Tracker]
  }

  extend type Mutation {
    addTracker(
      id: ID!
      task: Task!
      isTracking: Boolean
      startTime: String
      originalTime: String
    ): Tracker
    updateTracker(
      id: ID!
      task: Task!
      isTracking: Boolean
      startTime: String
      originalTime: String
    ): Tracker
    deleteTracker(id: ID!): Boolean
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
`;
