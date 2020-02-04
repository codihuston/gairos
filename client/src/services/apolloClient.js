import { ApolloClient } from "apollo-boost";
import { HttpLink, InMemoryCache } from "apollo-boost";
import { CachePersistor } from "apollo-cache-persist";
import { getApiGraphqlUrl } from "../config";

const API_HOST = "http://localhost:8000/graphql";
const SCHEMA_VERSION = "1";
const SCHEMA_VERSION_KEY = "apollo-schema-version";

const getApolloClient = async () => {
  const httpLink = new HttpLink({
    uri: getApiGraphqlUrl()
  });
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

  return new ApolloClient({ link: httpLink, cache });
};

export default getApolloClient;
