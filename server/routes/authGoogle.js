
const router = require('express').Router();
require("dotenv").config();
const passport = require('passport');
const googleController = require('../controler/authentication/google.controller');

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', async (err, profile) => {
    if (err) {
      console.error(err);
      return res.redirect(`${process.env.URL_FE}/login-error`);
    }
    if (!profile) {
      return res.redirect(`${process.env.URL_FE}/login-error`);
    }

    if (profile.existingUser) {
      // Người dùng cũ đã tồn tại, chuyển hướng đến trang nhập mật khẩu
      const email = encodeURIComponent(profile.email);
      const googleId = encodeURIComponent(profile.googleId);
      return res.redirect(`${process.env.URL_FE}/link-account?email=${email}&googleId=${googleId}`);
    }

    // Người dùng mới hoặc đã hoàn tất liên kết, chuyển hướng đến trang thành công
    res.redirect(`${process.env.URL_FE}/login-success/${profile.id}/${profile.tokenLogin}`);
  })(req, res, next);
});

router.post('/login-success', googleController.loginSuccess);

module.exports = router;
