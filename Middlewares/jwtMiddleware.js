const jwt = require("jsonwebtoken");
const jwtMiddleware = (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    if (token) {
      const jwtResponse = jwt.verify(
        token,
        process.env.jwt_secret,
        (error, decoded) => {
          if (error) {
            return res.status(401).json({ msg: "Invalid token" });
          } else {
            req.user = decoded.user;
            req.payload = jwtResponse.userId;
            next();
          }
        }
      );
    } else {
      res.status(401).json("No token detected");
    }
  } catch {
    res.status(403).json({ msg: "Nice try! Better luck next time." });
  }
};

module.exports = jwtMiddleware;
