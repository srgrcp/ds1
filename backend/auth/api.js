const express = require('express')
const authapi = express.Router()
const { signup, login, logout, checkToken, updateUser } = require('./controller')
const upload = require('./../uploadMiddleware')

authapi
.get('/test', (req, res)=>{
    res.json({message: __dirname.substr(0, __dirname.length-5)})
})
.post('/test', (req, res) => {
    res.json(req.body)
})
.post('/signup', signup)
.post('/login', login)
.post('/check', checkToken)
.post('/logout', logout)
.post('/update-user', upload.single('image'), updateUser)

module.exports = authapi