const jwt = require("jsonwebtoken");

// Checks the token sent in the header: Authorization: Bearer <token>
function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Please login first" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // available in the next route
    next();
  } catch (err) {
    return res.status(401).json({ message: "Session expired, login again" });
  }
}

module.exports = auth;
