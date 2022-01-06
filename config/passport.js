const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose")
const User = mongoose.model("user");

module.exports = function (passport) {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    });

    // Login
    passport.use('local', new LocalStrategy({
        usernameField: "email",
        passwordField: 'password',
        passReqToCallback: true
    },
    (req, email, password, done) => {
        User.findOne({ email }).then(user => {
            if (!user) {
                return done(null, false, req.flash('error_msg', 'Incorrect username.' ));
            }
            if (!user.validPassword(password)) {
                return done(null, false, req.flash('error_msg', 'Incorrect password.' ));
            }
            return done(null, user);
        }).catch(err => {
            done(err)
        })
    }
      ));
};
