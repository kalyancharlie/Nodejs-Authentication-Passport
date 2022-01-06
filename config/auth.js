module.exports = function(req, res, next) {
    console.log("Inside Auth Guard")
    if(!req.isAuthenticated()) {
        req.flash("error_msg", "Please Login to view the page")
        return res.redirect('/users/login')
    }
    next()
}