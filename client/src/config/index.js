/**
 * Global configuration variables (read-only) used throughout the project
 */
const API_HTTP_SCHEME = "http";
const API_DOMAIN = "localhost";
const API_PORT = "8000";
const API_AUTH_URL = "auth/google";
const API_GRAPHQL_URL = "graphql";

export const getApiRootUrl = () => {
  let url = "";

  if (API_PORT) {
    url = `${API_HTTP_SCHEME}://${API_DOMAIN}:${API_PORT}`;
  } else {
    url = `${API_HTTP_SCHEME}://${API_DOMAIN}`;
  }

  return url;
};

export const getApiAuthUrl = () => {
  return `${getApiRootUrl()}/${API_AUTH_URL}`;
};

export const getApiGraphqlUrl = () => {
  return `${getApiRootUrl()}/${API_GRAPHQL_URL}`;
};
