const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).send(error);
    }
  }
  if (!token) {
    res.status(401).send("no token");

  }
};
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send("no admin token");
  }
};

module.exports = { protect, admin };
