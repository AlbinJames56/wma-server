const jwt = require("jsonwebtoken");
const jwtMiddleware = (req, res, next) => {
  // console.log("inside jwt");
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json("No authorization header provided");
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json("Token missing in authorization header");
    }
    const jwtResponse = jwt.verify(
      token,
      process.env.jwt_secret,
      (error, decoded) => {
        if (error) {
          console.error("JWT Verification Error:", error);
          return res.status(401).json({ msg: "Invalid token" });
        } else {
          req.user = decoded.user;
          req.payload = decoded.userId;
          next();
        }
      }
    );
  } catch (error) {
    console.error("JWT Middleware Error:", error);
    res.status(403).json({ msg: "Nice try! Better luck next time." });
  }
};

module.exports = jwtMiddleware; 
