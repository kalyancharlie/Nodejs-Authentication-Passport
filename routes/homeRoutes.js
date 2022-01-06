const express = require('express')
const router = express.Router()

const HomeController = require('../controllers/homeController')

router.use((req, res, next) => {
    console.log(`Home Route:: Method: ${req.method} - URL:: ${req.url} - Body: ${req.body} - Params: ${req.params}`)
    next()
})

router.get('/', (req, res, next) => {
    res.redirect('/home')
})

router.get('/home',HomeController.home)

// router.route('/*').all(HomeController.pageNotFoundHandler)

module.exports = router