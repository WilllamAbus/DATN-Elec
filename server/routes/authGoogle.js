const express = require('express');
const router = require('express').Router();
require("dotenv").config();
const passport = require('passport');
const googleController = require('../controllers/googleController');

router.get('/google',
  passport.authenticate('google', { scope: ['profile',"email"],session:false }));

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', (err, profile) => {
    if (err) {
      return next(err);
    }
    req.user = profile;
    next();
  })(req, res, next);  
}, (req, res) => {
  const userId = req.user ? req.user.id : '';  
  res.redirect(`${process.env.URL_FE}/login-success/${userId}`);
});

router.post('/login-success', googleController.loginSuccess);

module.exports = router;
