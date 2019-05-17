const { Libro, Ejemplar, categorias, storeCodes } = require('./models')
const { getUser } = require('./../auth/controller')
const Resize = require('./../resize')

const AddLibro = async (req, res) => {
    user = getUser(req)
    if (!user) return res.json({ storeCode: storeCodes.NOT_LOOGEDIN })
    libro = req.body
    if (!libro.title) return res.json({ storeCode: storeCodes.NO_TITLE })
    if (!libro.categoria) return res.json({ storeCode: storeCodes.NO_CATEGORIA })
    li = await Libro.findOne({ title: libro.title })
    if (li) return res.json({ storeCode: storeCodes.TITLE_EXISTS })
    if (libro.isbn) {
        li = await Libro.findOne({ isbn: libro.isbn })
        if (li) return res.json({ storeCode: storeCodes.ISBN_EXISTS })
    }
    if (req.file){
        const imagePath = path.join(__dirname.substr(0, __dirname.length-6), '/dist/avatar')
        const fileUpload = new Resize(imagePath)
        libro.foto = await fileUpload.save(req.file.buffer, libro.title)
    }
    libro = new Libro(libro)
    await libro.save(er => {
        if (er) {console.log(er);return res.json({ storeCode: storeCodes.DB_ERROR })}
    })
    res.json({ storeCode: storeCodes.ADDED_OK })
}

const UpdateLibro = async (req, res) => {
    user = getUser(req)
    if (!user) return res.json({ storeCode: storeCodes.NOT_LOOGEDIN })
    libro = req.body
    if (libro.title){
        li = await Libro.findOne({ title: libro.title })
        if (li && String(li.id) != libro.id) return res.json({ storeCode: storeCodes.TITLE_EXISTS })
    }
    if (libro.isbn) {
        li = await Libro.findOne({ isbn: libro.isbn })
        if (li && String(li.id) != libro.id) return res.json({ storeCode: storeCodes.ISBN_EXISTS })
    }
    if (req.file){
        let title
        if (libro.title) title = libro.title
        else {
            li = await Libro.findById(libro.id)
            title = li.title
        }
        const imagePath = path.join(__dirname.substr(0, __dirname.length-6), '/dist/avatar')
        const fileUpload = new Resize(imagePath)
        libro.foto = await fileUpload.save(req.file.buffer, title)
    }
    await Libro.updateOne({ _id: libro.id }, libro, er => {
        if (er)
        {
            console.log(er)
            res.json({ storeCode: storeCodes.DB_ERROR })
        }
    })
    res.json({ storeCode: storeCodes.UPDATED_OK })
}

const DeleteLibro = (req, res) => {
    //  TODO
}

const GetLibro = async (req, res) => {
    title = req.params.title
    libro = await Libro.findOne({ title })//new RegExp(title, "i") })
    res.json(libro)
}

const GetLibros = async (req, res) => {
    let libros
    cat = req.params.cat
    if (cat) libros = await Libro.find({ categoria: cat })
    else libros = await Libro.find()
    res.json(libros)
}

const AddEjemplar = async (req, res) => {
    user = getUser(req)
    if (!user) return res.json({ storeCode: storeCodes.NOT_LOOGEDIN })
    ejemplar = req.body
    ejemplar.libro = await Libro.findOne({ _id: ejemplar.libro })
    ejemplar.user = user.id
    ejemplar = new Ejemplar(ejemplar)
    await ejemplar.save(er => {
        if (er){
            console.log(er)
            res.json({ storeCode: storeCodes.DB_ERROR })
        }
    })
    res.json({ storeCode: storeCodes.ADDED_OK })
}

const UpdateEjemplar = async (req, res) => {
    user = getUser(req)
    if (!user) return res.json({ storeCode: storeCodes.NOT_LOOGEDIN })
    udEjemplar = req.body.ejemplar
    ejemplar = await Ejemplar.findById(udEjemplar.id)
    if (ejemplar.user != user.id) return res.json({ storeCode: storeCodes.AUTH_ERROR })
    if (udEjemplar.libro instanceof String) udEjemplar.libro = await Libro.findOne({ _id: udEjemplar.libro })
    await Ejemplar.updateOne({ _id: udEjemplar.id }, udEjemplar, er => {
        if (er) {
            console.log(er)
            res.json({ storeCode: storeCodes.DB_ERROR })
        }
    })
    res.json({ storeCode: storeCodes.UPDATED_OK })
}

const DeleteEjemplar = async (req, res) => {
    user = getUser(req)
    if (!user) return res.json({ storeCode: storeCodes.NOT_LOOGEDIN })
    ejemplar = await Ejemplar.findById(req.body.id)
    if (ejemplar.user != user.id) return res.json({ storeCode: storeCodes.AUTH_ERROR })
    await Ejemplar.deleteOne({ _id: req.body.id }, er => {
        if (er) {
            console.log(er)
            res.json({ storeCode: storeCodes.DB_ERROR })
        }
    })
    res.json({ storeCode: storeCodes.DELETED_OK })
}

const GetEjemplar = async (req, res) => {
    id = req.params.id
    ejemplar = await Ejemplar.findOne({ _id: id })
    res.json(ejemplar)
}

const GetEjemplares = async (req, res) => {
    let ejemplares
    cat = req.params.cat
    if (cat) ejemplares = await Ejemplar.find({ 'libro.categoria': cat })
    else ejemplares = await Ejemplar.find()
    res.json(ejemplares)
}

module.exports =
{
    AddLibro,
    UpdateLibro,
    DeleteLibro,
    GetLibro,
    GetLibros,
    AddEjemplar,
    UpdateEjemplar,
    DeleteEjemplar,
    GetEjemplar,
    GetEjemplares
}