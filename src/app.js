const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport")
const morgan = require('morgan')
const authGuard = require('../config/auth')
const dotenv = require("dotenv");
dotenv.config();

// Routers
const homeRouter = require("../routes/homeRoutes");
const userRouter = require("../routes/userRoutes");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logging
app.use(morgan('dev'))

// Express Session Middleware
app.use(
    session({
        secret: "This is secret",
        resave: true,
        saveUninitialized: true,
    })
);

// Passport Auth Middleware
app.use(passport.initialize())
app.use(passport.session())

// Connect Flash Middleware
app.use(flash());

// Passport Config
require('../config/passport')(passport)

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
})

// Mongoose Connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then()
    .catch((err) => console.log(err));
mongoose.connection
    .once("open", () => {
        console.log("Connected to DB");
    })
    .on("error", (err) => console.warn("MongoDB Connection Error", err));

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// app.use(authGuard)

// Home Routes Middleware
app.use("/", homeRouter);
// User Routes Middleware
app.use("/users", userRouter);
// 404 Route
app.get("/*", (req, res) => {
    res.render("404");
});

module.exports = app;
