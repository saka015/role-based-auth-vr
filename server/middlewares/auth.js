const isLoggedIn = (req, res, next) => {
  if (req.session.user_id) {
    // Redirect unauthenticated users to login
    return res.redirect("/about");
  } else {
    return res.redirect("/login");
  }
  next(); // Proceed if authenticated
};

const isLoggedOut = (req, res, next) => {
  if (req.session.user_id) {
    // Redirect logged-in users to home and stop further execution
    return res.redirect("/about");
  }
  next(); // Proceed if not logged in
};

module.exports = { isLoggedIn, isLoggedOut };
