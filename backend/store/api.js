const express = require('express')
const storeapi = express.Router()
const { 
    AddLibro,
    UpdateLibro,
    DeleteLibro,
    GetLibro,
    GetLibros,
    AddEjemplar,
    UpdateEjemplar,
    GetEjemplar,
    GetEjemplares
    } = require('./controller')
const upload = require('./../uploadMiddleware')

storeapi
.post('/add-libro', upload.single('image'), AddLibro)
.post('/update-libro', upload.single('image'), UpdateLibro)
.post('/delete-libro', DeleteLibro)
.get('/libro/:title', GetLibro)
.get('/libros/:cat', GetLibros)
.get('/libros', GetLibros)
.post('/add-ejemplar', AddEjemplar)
.post('/update-ejemplar', UpdateEjemplar)
.get('/ejemplar/:id', GetEjemplar)
.get('/ejemplares', GetEjemplares)
.get('/ejemplares/:cat', GetEjemplares)

module.exports = storeapi