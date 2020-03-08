/**
 * Global configuration variables (read-only) used throughout the project
 */
const API_HTTP_SCHEME = process.env.REACT_APP_API_HTTP_SCHEME;
const API_DOMAIN = process.env.REACT_APP_API_DOMAIN;
const API_PORT = process.env.REACT_APP_API_PORT;
const API_AUTH_URL = process.env.REACT_APP_API_AUTH_URL;
const API_LOGOUT_URL = process.env.REACT_APP_API_LOGOUT_URL;
const API_GRAPHQL_URL = process.env.REACT_APP_API_GRAPHQL_URL;

export const APP_NAME = process.env.REACT_APP_NAME;

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

export const getApiLogoutUrl = () => {
  return `${getApiRootUrl()}/${API_LOGOUT_URL}`;
};

export const getApiGraphqlUrl = () => {
  return `${getApiRootUrl()}/${API_GRAPHQL_URL}`;
};
