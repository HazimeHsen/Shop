const jwt = require("jsonwebtoken");
const generateToken = (user) => {
  return jwt.sign(
    {
      //we do this to not enter the password
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};
const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send({ message: "No authorization header" });
  }

  const token = authorization.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};
module.exports = { isAuth, generateToken };
