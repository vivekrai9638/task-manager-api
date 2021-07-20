const User = require("../models/user");
const jwt = require("jsonwebtoken");

const auth = async function (req, res, next) {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = await jwt.verify(token, "thisissignature");
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) throw new Error();

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    res.status(401).send({ error: "Please Authenticate" });
  }
};

module.exports = auth;
