import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache
} from "apollo-boost";
import { CachePersistor } from "apollo-cache-persist";
import { getApiGraphqlUrl } from "../config";
import { onError } from "apollo-link-error";

import { isDevelopment } from "../utils";
import typeDefs from "../graphql/typedefs";
import resolvers from "../graphql/resolvers";
import { GET_MY_TRACKERS } from "../graphql/queries";

// use this to switch to new cache (if needed)
const SCHEMA_VERSION = "1";
const SCHEMA_VERSION_KEY = "apollo-schema-version";

// default http request configuration
const httpLink = new HttpLink({
  uri: getApiGraphqlUrl(),
  credentials: "include"
});

// default graphql error handler
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`[GraphQL error]: Message: ${message}`);

      // do not display this in production
      if (isDevelopment) {
        console.log(`[GraphQL error]: Location`, locations);
        console.log(`[GraphQL error]: Path`, path);
      }
    });

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

/**
 * Initializes the apollo client with the above settings
 */
const getApolloClient = async () => {
  // apply links
  const link = ApolloLink.from([errorLink, httpLink]);

  // init cache
  const cache = new InMemoryCache();

  // configure a persistent cache using local storage
  const persistor = new CachePersistor({
    cache,
    storage: window.localStorage,
    // 4MB (chrome local storage max is 5MB)
    maxSize: 419428
    // debug: true // prints cache size as it changes in realtime
  });

  // use the current version
  const currentVersion = window.localStorage.getItem(SCHEMA_VERSION_KEY);

  // this clears the cache if the current version is newer than the one in cache
  if (currentVersion === SCHEMA_VERSION) {
    await persistor.restore();
  } else {
    await persistor.purge();
    window.localStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
  }

  // initialize any cached values (for client-side queries)
  try {
    cache.readQuery({
      query: GET_MY_TRACKERS
    });
  } catch (error) {
    // if they are not initialized yet, initialize them
    cache.writeData({
      data: { getTrackers: [] }
    });
  }

  // return the apollo client instance
  return new ApolloClient({ link, cache, resolvers, typeDefs });
};

export default getApolloClient;
