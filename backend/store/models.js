const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const Review = new Schema({
    user: { type: ObjectId, required: true },
    body: { type: String, required: true }
}, { _id: false })

const Libro = new Schema({
    title: { type: String, required: true, unique: true },
    year: Number,
    autor: String,
    editorial: String,
    categoria: { type: Number, required: true },
    foto: { type: String, default: 'default.jpg' },
    review: { type: [Review], default: [] },
    isbn: String,
    descripcion: String
})

const Ejemplar = new Schema({
    libro: { type: Libro, required: true },
    user: { type: ObjectId, required: true },
    venta: { type: Boolean, required: true },
    nuevo: { type: Boolean, required: true },
    precio: { type: Number, required: true },
    cantidad: { type: Number, default: 1 }
})

const categorias = 
{
    POLICIAL_THRILLER: { title: 'Policial (o Thriller)', id: 0},
    ROMANTICA: { title: 'Romántica', id: 1 },
    AVENTURA: { title: 'Aventura', id: 2 },
    TERROR: { title: 'Terror', id: 3 },
    FICCION_REALIDAD: { title: 'Ficcion / Realidad', id: 4 },
    C_FICCION: { title: 'Ciencia Ficción', id: 5 },
    INVESTIGACION: { title: 'Investigación', id: 6 },
    BIOGRAFIA: { title: 'Biográfica', id: 7 },
    INFANTIL: { title: 'Infantil', id: 8 },
    AUTOAYUDA: { title: 'Autoayuda', id: 9 },
    EROTICA: { title: 'Erótica', id: 10 },
    HOGAR: { title: 'Hogar', id: 11 },
    ENCICLOPEDIA: { title: 'Enciclopedia / Manual', id: 12 },
    POLITICA: { title: 'Política', id: 13 },
    ECONOMIA: { title: 'Economía / Marketing', id: 14 },
    SOCIEDAD: { title: 'Sociedad', id: 15 },
    DEPORTES: { title: 'Deportes', id: 16 },
    VIAJES_CULTURA: { title: 'Viajes / Cultura', id: 17 },
    OTROS: { title: 'Otros temas / Varios', id: 18 }
}

const storeCodes =
{
    NOT_LOOGEDIN: 0,
    NO_TITLE: 1,
    NO_CATEGORIA: 2,
    TITLE_EXISTS: 3,
    ISBN_EXISTS: 4,
    ADDED_OK: 5,
    DB_ERROR: 6,
    UPDATED_OK: 7,
    AUTH_ERROR: 8,
    DELETED_OK: 9
}

module.exports =
{
    Libro: mongoose.model('Libro', Libro),
    Ejemplar: mongoose.model('Ejemplar', Ejemplar),
    EjemplarSchema: Ejemplar,
    categorias,
    storeCodes
}