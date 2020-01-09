import createError from "http-errors";

export default function(req, res, next) {
  const isAuthenticated = req.session.isAuthenticated || false;
  const hasAccessToken =
    (req.session.tokens && req.session.tokens.access_token) || false;

  console.log(
    "auth middleware invoked",
    isAuthenticated,
    hasAccessToken,
    isAuthenticated && hasAccessToken
  );

  if (isAuthenticated && hasAccessToken) {
    return next();
  }
  return next(createError(401));
}
