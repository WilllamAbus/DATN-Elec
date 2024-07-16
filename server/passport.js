const GoogleStrategy = require('passport-google-oauth20').Strategy;
require("dotenv").config();
const passport = require('passport');
const User = require('./model/users.model'); // Đảm bảo đường dẫn này đúng


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
},
    async function (accessToken, refreshToken, profile, cb) {
        try {
            if (profile && profile.id) {
                let user = await User.findOne({ 'socialLogin.googleId': profile.id });

                if (!user) {
                    // Tạo một mật khẩu ngẫu nhiên
                    const randomPassword = Math.random().toString(36).slice(-8);

                    user = new User({
                        name: profile.displayName,
                        email: profile.emails[0] && profile.emails[0].value,
                        avatar: profile.photos[0] && profile.photos[0].value,
                        socialLogin: { googleId: profile.id },
                        password: randomPassword, // Gán mật khẩu ngẫu nhiên vào trường password
                        isEmailVerified: true,
                    });

                    await user.save();
                }
                console.log(profile);
                return cb(null, user);
            } else {
                return cb(new Error("No profile ID found"), null);
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
