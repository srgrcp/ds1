const { Libro, Ejemplar, categorias, storeCodes } = require('./models')
const { getUser } = require('./../auth/controller')

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
    libro = new Libro(libro)
    await libro.save(er => {
        if (er) {console.log(er);return res.json({ storeCode: storeCodes.DB_ERROR })}
    })
    res.json({ storeCode: storeCodes.ADDED_OK })
}

const EditLibro = (req, res) => {
    user = getUser(req)
    if (!user) return res.json({ storeCode: storeCodes.NOT_LOOGEDIN })
    //  TODO
}

const DeleteLibro = (req, res) => {

}

const GetLibro = (req, res) => {

}

const GetLibros = (req, res) => {

}