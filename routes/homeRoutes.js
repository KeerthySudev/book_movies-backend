const express = require("express");
const passport = require("passport");
const router = express.Router();
const { emailVerify } = require("../controllers/home/homeController");
const { verifyOtp } = require("../controllers/home/homeController");

router.post("/emailVerify", emailVerify);
router.post("/verifyOtp", verifyOtp);

// Route to initiate Google OAuth authentication---
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Route to handle the Google OAuth callback after authentication----
router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  console.log("mail", req.user.email);
  console.log("id", req.user._id);
  const userRole = req.user.role;

  if (userRole === "admin") {
    res.redirect("http://localhost:3000/admin/movie");
  } else {
    res.redirect("http://localhost:3000/register/profile");
  }
});

// Route to use Passport's logout method to end the user's session
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    // Destroy the session to clear all session data
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie("connect.sid");
      res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
    });
  });
});

// Route to check the current session and return user data if authenticated
router.get("/session", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.json(req.user);
});

module.exports = router;
