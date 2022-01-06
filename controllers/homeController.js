module.exports = {
    home(req, res, next) {
        res.render('welcome')
    },
    pageNotFoundHandler(req, res, next) {
        res.render("404")
    }
}