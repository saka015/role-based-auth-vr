// // const isLoggedIn = (req, res, next) => {
// //   if (req.session.user_id) {
// //     // Redirect unauthenticated users to login
// //     return res.redirect("/about");
// //   } else {
// //     return res.redirect("/login");
// //   }
// //   next(); // Proceed if authenticated
// // };

// // const isLoggedOut = (req, res, next) => {
// //   if (req.session.user_id) {
// //     // Redirect logged-in users to home and stop further execution
// //     return res.redirect("/about");
// //   }
// //   next(); // Proceed if not logged in
// // };

// // module.exports = { isLoggedIn, isLoggedOut };

// // new

// const jwt = require("jsonwebtoken");

// const isLoggedIn = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; //Attach user info to the request
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
// };

// const isLoggedOut = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (authHeader) {
//     return res.status(400).json({ message: "Already logged in!" });
//   }
//   next();
// };

// module.exports = { isLoggedIn, isLoggedOut };

const jwt = require("jsonwebtoken");

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

module.exports = { isLoggedIn, isLoggedOut };
