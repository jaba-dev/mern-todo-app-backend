const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (token) {
    req.body.token = token;
    next();
  } else {
    res.status(403).json("unauthorized!");
  }
};

module.exports = verifyToken;
