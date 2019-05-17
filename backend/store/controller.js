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
    libro = await Libro.findOne({ title })
    res.json(libro)
}

const GetLibros = async (req, res) => {
    libros = await Libro.find()
    res.json(libros)
}

module.exports =
{
    AddLibro,
    UpdateLibro,
    DeleteLibro,
    GetLibro,
    GetLibros
}