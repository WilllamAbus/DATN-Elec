const router = require("express").Router();
require("dotenv").config();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const googleController = require("../controler/authentication/auth.controller");
const linkAccount = require("../controler/authentication/linkAccount");
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", async (err, profile) => {
    if (err) {
      console.error(err);
      return res.redirect(`${process.env.URL_FE}/login-error`);
    }
    if (!profile) {
      return res.redirect(`${process.env.URL_FE}/login-error`);
    }
    if (profile.existingUser) {
      const token = jwt.sign(
        {
          email: profile.email,
          googleId: profile.googleId,
        },
        process.env.JWT_ACCESS_KEY, 
        { expiresIn: '1h' } 
      );
      return res.redirect(`${process.env.URL_FE}/link-account?token=${token}`);
    }

    res.redirect(
      `${process.env.URL_FE}/login-success/${profile.id}/${profile.tokenLogin}`
    );
  })(req, res, next);
});

router.post("/login-success", googleController.loginSuccess);
router.post("/link-account", linkAccount.linkAccount);



module.exports = router;
