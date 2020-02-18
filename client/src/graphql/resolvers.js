import { GET_MY_TRACKERS } from "./queries";

const findTracker = (trackers, id) => {
  for (let i = 0; i < trackers.length; i++) {
    if (trackers[i].id === id) {
      return trackers[i];
    }
  }
  return false;
};

export default {
  Mutation: {
    // get required fields
    addTracker(parent, args, { cache }) {
      const { id, task, isTracking, originalTime, startTime } = args;
      let trackerExists = false;

      // get existing trackers
      const queryResult = cache.readQuery({
        query: GET_MY_TRACKERS
      });
      const { getTrackers } = queryResult;

      // if there are any...
      if (queryResult && getTrackers) {
        trackerExists = findTracker(getTrackers, task.userTaskInfo.id);
      }

      // if tracker is already being tracked, skip caching it
      if (!trackerExists) {
        const data = {
          getTrackers: [
            ...getTrackers,
            // add fields as needed
            {
              type: "id",
              __typename: "Tracker",
              id,
              task,
              isTracking,
              startTime,
              originalTime
            }
          ]
        };

        // cache it
        cache.writeQuery({ query: GET_MY_TRACKERS, data });

        return data.getTrackers;
      } else {
        // the tracker already exists
      }

      return trackerExists;
    },
    updateTracker(parent, args, { cache }) {
      // implement on TRACKER UPDATE
      const { id, task, isTracking, startTime, originalTime } = args;

      // get existing trackers
      const queryResult = cache.readQuery({
        query: GET_MY_TRACKERS
      });
      const { getTrackers } = queryResult;

      // if there are any...
      if (queryResult && getTrackers) {
        // get the tracker-to-be-updated
        let trackerExists = findTracker(getTrackers, task.userTaskInfo.id);

        if (trackerExists) {
          // shape what will be stored in cache
          const otherTrackers = getTrackers.filter(
            tracker => tracker.task.userTaskInfo.id !== task.userTaskInfo.id
          );

          const data = {
            getTrackers: [
              ...otherTrackers,
              // add fields as needed
              {
                type: "id",
                __typename: "Tracker",
                id,
                task,
                isTracking,
                startTime,
                originalTime
              }
            ]
          };

          // cache it
          cache.writeQuery({ query: GET_MY_TRACKERS, data });

          return data;
        } else {
          console.warn(
            "No tracker was found for the given task, could not update."
          );
        }
      } else {
        console.warn("There are no trackers for tasks of which to update.");
      }
    },
    deleteTracker(parent, args, { cache }) {
      const { id } = args;

      // get existing trackers
      const queryResult = cache.readQuery({
        query: GET_MY_TRACKERS
      });

      // if there are any...
      if (queryResult) {
        const { getTrackers } = queryResult;
        // get the tracker-to-be-updated
        let trackerExists = findTracker(getTrackers, id);

        if (trackerExists) {
          // shape what will be stored in cache
          const otherTrackers = getTrackers.filter(
            tracker => tracker.task.userTaskInfo.id !== id
          );

          // delete this task (set getTrackers to array without this obj)
          const data = {
            getTrackers: [...otherTrackers]
          };

          // cache it
          cache.writeQuery({ query: GET_MY_TRACKERS, data });

          return data;
        } else {
          // the tracker does not exist...
          console.warn(
            "A tracker does not exist for the given task... could not delete."
          );
        }
      } else {
        console.warn("There are no trackers of which to delete.");
      }
    }
  }
};
