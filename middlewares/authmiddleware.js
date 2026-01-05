const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);

    // TEMP TOKEN
    if (decoded.isTemp) {
      req.user = { phone: decoded.phone };
    } else {
      req.user = decoded;
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
