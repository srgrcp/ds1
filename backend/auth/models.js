const uuid = require('uuid/v4')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const User = new Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    carrito: { type: Array, default: [] },
    domicilio: String
})

const Token = new Schema({
    _id: { type: String, default: uuid },
    user: { type: ObjectId, required: true },
    created: { type: Date, default: Date.now }
})

Token.index({ created: 1 }, { expires: 86400 })

const authCodes = Object.freeze({
    SIGNUP_OK: 0,
    USER_EXISTS: 1,
    EMAIL_EXISTS: 2,
    WRONG_USER: 3,
    WRONG_PASSWORD: 4,
    EMPTY_U_P_E: 5,         //  User    Password    Email
    DB_ERROR: 6,
    LOGOUT_OK: 7,
    LOGOUT_ERROR: 8,
    NOT_LOGGEDIN: 9,
    LOGGEDIN: 10,
    LOGIN_ERROR: 11,
    LOGIN_OK: 12
})

module.exports =
{
    authCodes,
    User: mongoose.model('User', User),
    Token: mongoose.model('Token', Token)
}