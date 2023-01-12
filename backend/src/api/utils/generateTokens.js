const jwt = require("jsonwebtoken");

const generateToken = (id, time) => {
  console.log(time);
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: `${time}`,
  });
};
module.exports = generateToken;
