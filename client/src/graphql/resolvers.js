import { clone } from "lodash";

import { GET_MY_TRACKERS } from "./queries";

const findTracker = (trackers, id) => {
  for (let i = 0; i < trackers.length; i++) {
    if (trackers[i].id === id) {
      return [trackers[i], i];
    }
  }
  return false;
};

export default {
  Mutation: {
    // get required fields
    addTracker(parent, args, { cache }) {
      const {
        id,
        task,
        isTracking,
        originalTime,
        startTime,
        elapsedTime
      } = args;

      let existingTracker = false;

      // get existing trackers
      const queryResult = cache.readQuery({
        query: GET_MY_TRACKERS
      });
      const { getTrackers } = queryResult;

      // if there are any...
      if (queryResult && getTrackers) {
        existingTracker = findTracker(getTrackers, task.userTaskInfo.id);
      }

      // if tracker is already being tracked, skip caching it
      if (!existingTracker) {
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
              elapsedTime,
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

      return existingTracker;
    },
    updateTracker(parent, args, { cache }) {
      // implement on TRACKER UPDATE
      const {
        id,
        task,
        isTracking,
        startTime,
        originalTime,
        elapsedTime
      } = args;

      // get existing trackers
      const queryResult = cache.readQuery({
        query: GET_MY_TRACKERS
      });
      const { getTrackers } = queryResult;

      // if there are any...
      if (queryResult && getTrackers) {
        // get the tracker-to-be-updated
        let [existingTracker, index] = findTracker(
          getTrackers,
          task.userTaskInfo.id
        );
        if (existingTracker && index >= 0 && getTrackers[index]) {
          // update the tracker at the given index
          const temp = clone(getTrackers);
          temp[index] = {
            type: "id",
            __typename: "Tracker",
            id,
            task,
            isTracking,
            startTime,
            originalTime,
            elapsedTime
          };
          const data = {
            getTrackers: temp
          };

          // delete old mutations (they hog up cache, and no longer needed)
          Object.keys(cache.data.data.ROOT_MUTATION).forEach(key => {
            if (
              key.includes("updateTracker") &&
              key.includes(task.userTaskInfo.id)
            ) {
              delete cache.data.data.ROOT_MUTATION[key];
            }
          });

          // cache.writeQuery({ query: GET_MY_TRACKERS, data });
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
      return null;
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
        let existingTracker = findTracker(getTrackers, id);

        if (existingTracker) {
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
