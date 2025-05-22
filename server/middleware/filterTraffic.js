export const filterJsonReq = (req, res, next) => {
  if (req.accepts("application/json")) {
    next();
  }
  if (req.accepts("text/html")) {
    res.status(405).send("Operation Not Allowed");
  }
};
