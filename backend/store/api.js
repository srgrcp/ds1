const express = require('express')
const storeapi = express.Router()

storeapi
.get('/test', (req, res) => {
    res.json({ test: 'hola que hace' })
})

module.exports = storeapi