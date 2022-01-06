const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require('passport')

module.exports = {
    userLoginGET(req, res, next) {
        try {
            res.render("login")
        } catch(err) {
            res.send("Login GET error")
        }
    },
    userLoginPOST(req, res, next) {
        try {
            passport.authenticate('local', {
                successRedirect: '/users/dashboard',
                failureRedirect: '/users/login',
                failureFlash: true
            })(req, res, next)
        } catch(err) {
            res.send("login error")
        }
    },
    userRegisterGET(req, res, next) {
        res.render("register");
    },
    userRegisterPOST(req, res, next) {
        let errors = [],
            name = "",
            email = "";
        try {
            let name = req.body.name;
            let email = req.body.email;
            const { password, password2 } = req.body;
            console.log(req.body);
            const newUser = new User(req.body);
            if (password != password2) {
                errors.push({ msg: "Passwords not matching" });
            }
            if (!name || !email || !password) {
                errors.push({ msg: "Please fill all fields" });
                    return res.render("register", {
                        errors,
                        name,
                        email,
                    });
            }
            User.findOne({ email: email }).then((user) => {
                if (user) {
                    errors.push({ msg: "User with email already exists" });
                    return res.render("register", {
                        errors,
                        name,
                        email,
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password,
                    });
                    // Password Hashing
                    // bcrypt.genSalt(10, (err, salt) => {
                    //     console.log("SALT:", salt);
                    //     bcrypt.hash(newUser.password, salt, (err, hash) => {
                    //         console.log("HASH:", hash);
                    //         newUser.password = hash;
                    //         newUser.save().then(() => {
                    //             res.send("Registerd");
                    //         });
                    //     });
                    // });
                    // OR
                    bcrypt.hash(newUser.password, 10, (err, hash) => {
                        newUser.password = hash;
                        newUser.save().then(() => {
                            req.flash('success_msg', 'You are registered now and can log in')
                            res.render('/users/login')
                        });
                    });
                }
            });
        } catch (err) {
            let newErr = err.errors.name.properties.message;
            if (newErr) {
                errors.push({ msg: newErr });
            } else {
                errors.push({msg: err})
            }
            res.render("register", {
                errors,
                name,
                email,
            });
        }
    },
    userDashboard(req, res) {
        try {
            res.render('dashboard', {
                user: req.user
            })
        } catch (err) {
            res.render('404')
        }
    },
    userLogout(req, res) {
        try {
            req.flash('success_msg', 'You are logged out successfully')
            req.logout()
            res.redirect('/users/login')
        } catch(err) {
            res.render("404")
        }
    },
    pageNotFoundHandler(req, res, next) {
        res.render("404");
    },
};
