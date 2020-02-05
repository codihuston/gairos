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

const SCHEMA_VERSION = "1";
const SCHEMA_VERSION_KEY = "apollo-schema-version";

const httpLink = new HttpLink({
  uri: getApiGraphqlUrl(),
  credentials: "include"
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) => {
      console.error(`[GraphQL error]: Message: ${message}`);

      // do not display this in production
      if (isDevelopment) {
        console.log(`[GraphQL error]: Location`, locations);
        console.log(`[GraphQL error]: Path`, path);
      }
    });

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const getApolloClient = async () => {
  const link = ApolloLink.from([errorLink, httpLink]);

  const cache = new InMemoryCache();

  const persistor = new CachePersistor({
    cache,
    storage: window.localStorage
  });

  const currentVersion = window.localStorage.getItem(SCHEMA_VERSION_KEY);

  if (currentVersion === SCHEMA_VERSION) {
    await persistor.restore();
  } else {
    await persistor.purge();
    window.localStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
  }

  return new ApolloClient({ link, cache });
};

export default getApolloClient;
