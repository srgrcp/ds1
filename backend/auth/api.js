const express = require('express')
const authapi = express.Router()
const { signup, login, logout, checkToken } = require('./controller')

authapi
    .get('/test', (req, res)=>{
        res.json({message: 'auth api works'})
    })
    .post('/test', (req, res) => {
        res.json(req.body)
    })
    .post('/signup', signup)
    .post('/login', login)
    .post('/check', checkToken)
    .post('/logout', logout)

module.exports = authapi