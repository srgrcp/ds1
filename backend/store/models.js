const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const Review = new Schema({
    user: { type: ObjectId, required: true },
    body: { type: String, required: true }
}, { _id: false })

const Libro = new Schema({
    titulo: { type: String, required: true },
    year: Number,
    autor: { type: [String], required: true },
    editorial: { type: String, required: true },
    categoria: { type: Number, required: true },
    foto: { type: String, default: 'default.jpg' },
    review: { type: [Review], default: [] },
    isbn: String
})

const Ejemplar = new Schema({
    libro: { type: Libro, required: true },
    user: { type: ObjectId, required: true },
    venta: { type: Boolean, required: true },
    nuevo: { type: Boolean, required: true },
    precio: { type: Number, required: true },
    cantidad: { type: Number, default: 1 }
})

module.exports =
{
    Libro: mongoose.model('Libro', Libro)
}