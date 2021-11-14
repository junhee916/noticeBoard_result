const express = require('express')
const router = express.Router()

// 프론트 connect
router

.get('/signup', (req, res) => {
    res.render('./signup.html')
})
.get('/login', (req, res) => {
    res.render('./login.html')
})

router

.get('/index', (req, res) => {
    res.render('./board.html')
})
.get('/show', (req, res) => {
    res.render('./show.html')
})

module.exports = router