import jwt from "jsonwebtoken";

 const isLoggedIn = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

 const isLoggedOut = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    return res.status(400).json({ message: "Already logged in!" });
  }
  next(); // Proceed if not logged in
};

export default { isLoggedIn, isLoggedOut };
