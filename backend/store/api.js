const express = require('express')
const storeapi = express.Router()
const { AddLibro, UpdateLibro, DeleteLibro, GetLibro, GetLibros } = require('./controller')
const upload = require('./../uploadMiddleware')

storeapi
.get('/test', (req, res) => {
    res.json({ test: 'hola que hace' })
})
.post('/add-libro', upload.single('image'), AddLibro)
.post('/update-libro', upload.single('image'), UpdateLibro)
.post('/delete-libro', DeleteLibro)
.get('/libro/:title', GetLibro)
.get('/libros', GetLibros)

module.exports = storeapi