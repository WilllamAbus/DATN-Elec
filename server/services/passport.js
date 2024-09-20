const GoogleStrategy = require('passport-google-oauth20').Strategy;
require("dotenv").config();
const passport = require('passport');
const User = require('../model/users.model');
const { v4: uuidv4 } = require('uuid');
const Role = require('../model/role.model');
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
},
    async function (accessToken, refreshToken, profile, cb) {
        try {
            if (profile && profile.id) {
                let user = await User.findOne({ 'socialLogin.googleId': profile.id });
                const randomPassword = Math.random().toString(36).slice(-8);
                let created = false;

                if (!user) {
                    user = await User.findOne({ email: profile.emails[0].value });
                    if (user) {
                        profile.existingUser = true;
                        profile.email = profile.emails[0].value;
                        profile.googleId = profile.id;
                        return cb(null, profile);
                    } else {
                        const tokenLogin = uuidv4();
                        profile.tokenLogin = tokenLogin;
                        const userRole = await Role.findOne({ name: 'user' });
                        user = new User({
                            name: profile.displayName,
                            email: profile.emails && profile.emails[0] ? profile.emails[0].value : '',
                            avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
                            socialLogin: { googleId: profile.id },
                            isEmailVerified: true,
                            tokenLogin,
                            roles: [userRole._id]
                        });
                        await user.save();
                        created = true;
                    }
                }

                if (!created && user) {
                    const tokenLogin = uuidv4();
                    profile.tokenLogin = tokenLogin;
                    await User.updateOne({ 'socialLogin.googleId': profile.id }, { tokenLogin });
                    user.tokenLogin = tokenLogin;
                }

                return cb(null, user);
            } else {
                return cb(new Error("Không tìm thấy ID hồ sơ"), null);
            }
        } catch (err) {
            return cb(err, null); 
        }
    }
));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
