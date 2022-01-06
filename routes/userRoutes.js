const express = require('express')
const router = express.Router()

const UserController = require('../controllers/userController')

router.use((req, res, next) => {
    console.log(`User Route:: Method: ${req.method} - URL:: ${req.url} - Body: ${req.body} - Params: ${req.params}`)
    next()
})

const isAuthenticated = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.flash('error_msg', 'Please login to view the page')
        return res.redirect('/users/login')
    }
    next()
}

const isAlreadyAutheticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        return res.redirect('/users/dashboard')
    }
    next()
}


// Login Page
router.get('/login', isAlreadyAutheticated, UserController.userLoginGET)
// Login Page
router.route('/validate-login').post(UserController.userLoginPOST)
// Register Page
router.route('/register').get(UserController.userRegisterGET)
// Register Handler
router.route('/register').post(UserController.userRegisterPOST)
// Dashboard Page
router.get('/dashboard', isAuthenticated, UserController.userDashboard)
// User Logout
router.route('/logout').get(UserController.userLogout)
// 404 Handler
// router.route('*').all(UserController.pageNotFoundHandler)

module.exports = router