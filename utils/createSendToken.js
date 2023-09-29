const jwt = require("jsonwebtoken");

const signTokenAdmin = (id) => {
  return jwt.sign({ id }, process.env.JWT_ADMIN, {
    expiresIn: "24h",
  });
};

exports.createSendToken = (user, statusCode, res) => {
  const token = signTokenAdmin(user.uuid);

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  });

  res.status(statusCode).json({ token });
};
