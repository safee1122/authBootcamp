const User = require("../../models/user.model");
const generateToken = require("../../utils/generateTokens");
const jwt = require("jsonwebtoken");

const authUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    user.logIn();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: user.token,
      refreshToken: user.refreshToken,
    });
  } else {
    res.status(401).send("invalid auth");
  }
};
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email:email });
  if (userExists) {
    res.status(400).send("user already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  if (user) {
    res.status(201).send(user);
  } else {
    res.status(400).send("invalid user data");
  }
};

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  console.log(user);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404).send("profile failed");
    
  }
};

const refreshToken = async (req, res) => {
  const refreshToken = req.headers.authorization.split(" ")[1];
  try {
    var decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    user.token = generateToken(user._id, "1h");

    if (user.refreshToken === refreshToken) {
      res.json({
        token: user.token,
      });
    } else {
      res.status(401);
      throw new Error("invalid auth token");
    }
  } catch (err) {
    // err
    if (err.message === "jwt expired") {
      const user = User.findOne({ refreshToken: refreshToken }).exec();
      user.token = undefined;
      user.refreshToken = undefined;
      user.save();
      res.send("loggedout");
    }
    res.json(err);
  }
};
const userLogout = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select("-password");
  if (user) {
    user.token = undefined;
    user.save();
    res.send("logout successful");
  } else {
    res.status(401).send("logout failed");
  }
};
const getUser = async (req, res) => {
  const users = await User.find({});
  if (users) {
    res.json(users);
  } else {
    res.status(404);
    throw new Error("user not found");
  }
};
module.exports = {
  authUser,
  getUserProfile,
  registerUser,
  refreshToken,
  userLogout,
  getUser,
};
