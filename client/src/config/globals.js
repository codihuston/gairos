/**
 * Global variables used throughout the project. Use sparingly...
 */
window.API_HTTP_SCHEME = "http";
window.API_DOMAIN = "localhost";
window.API_PORT = "8000";
window.API_ROOT_URL = undefined;
window.API_AUTH_URL = undefined;

(function setApiUrl() {
  if (window.API_PORT) {
    window.API_ROOT_URL = `${window.API_HTTP_SCHEME}://${window.API_DOMAIN}:${window.API_PORT}`;
  } else {
    window.API_ROOT_URL = `${window.API_HTTP_SCHEME}://${window.API_DOMAIN}`;
  }

  window.API_AUTH_URL = `${window.API_ROOT_URL}/auth/google`;
})();
