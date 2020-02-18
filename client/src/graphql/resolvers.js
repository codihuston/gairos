import { GET_MY_TRACKERS } from "./queries";

export default {
  Mutation: {
    // TODO: get require fields
    addTracker(parent, args, { cache }) {
      console.log("QQQ ARGS", args);
      const { id, task, isTracking, originalTime } = args;

      // get existing trackers
      const queryResult = cache.readQuery({
        query: GET_MY_TRACKERS
      });

      // if there are any...
      if (queryResult) {
        const { getTrackers } = queryResult;
        let trackerExists = false;

        for (let i = 0; i < getTrackers.length; i++) {
          if (getTrackers[i].id === id) {
            trackerExists = true;
          }
        }

        // if tracker is already being tracked, skip caching it
        if (!trackerExists) {
          console.log("SPREAD", ...getTrackers);
          const data = {
            getTrackers: [
              ...getTrackers,
              // TODO: add fields as needed
              {
                type: "id",
                __typename: "Tracker",
                id,
                task,
                isTracking,
                originalTime
              }
            ]
          };

          console.log("QQQ write", data.getTrackers);
          // cache it
          cache.writeQuery({ query: GET_MY_TRACKERS, data });

          return data.getTrackers;
        }
      }
      return [];
    },
    removeTracker(parent, args, { cache }) {
      // TODO: implement on TRACKER STOP
    }
  }
};
