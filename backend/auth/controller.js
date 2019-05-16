const { authCodes, User, Token } = require('./models')
const sha1 = require('js-sha1')

//  Get user from token
const getUser = async (req) =>{
    if(req.headers.authorization){
        tok = req.headers.authorization.split(' ')[1]
        var token = await Token.findById(tok)
        if (!token) return undefined
        token.updated = Date.now
        token.save()
        return User.findById(token.user)
    }
    return undefined
}

//  Registro
const signup = async (req, res) => {
    if(!req.body.username || !req.body.password || !req.body.email) return res.json({ authCode: authCodes.EMPTY_U_P_E })
    let userq = await User.findOne({ username: req.body.username })
    if (userq) return res.json({ authCode: authCodes.USER_EXISTS })
    userq = await User.findOne({ email: req.body.email })
    if (userq) return res.json({ authCode: authCodes.EMAIL_EXISTS })
    req.body.password = sha1(req.body.password)
    var nuser = new User(req.body)
    await nuser.save(er => {if (er){console.log(er);return res.json({ authCode: authCodes.DB_ERROR })}})
    var token = new Token({ user: nuser.id })
    await token.save(er => {if (er){console.log(er);return res.json({ authCode: authCodes.DB_ERROR })}})
    res.json({ authCode: authCodes.SIGNUP_OK, token })
}

const login = async (req, res) => {
    let user = await User.findOne({ username: req.body.username })
    if (!user)
        return res.json({ authCode: authCodes.USER_INCORRECT })
    if(sha1(req.body.password) != user.password)
        return res.json({ authCode: authCodes.WRONG_PASSWORD })
    let token = new Token({ user: user.id })
    await token.save()
    res.json({ authCode: authCodes.LOGIN_OK, token: token.id })
}

const logout = async (req, res) => {
    if (getUser(req)) {
        await Token.findByIdAndDelete(req.headers.authorization.split(' ')[1])
        res.json({ authCode: authCodes.LOGOUT_OK })
    }
    else res.json({ authCode: authCodes.LOGOUT_ERROR })
}

//  Verificar que existe el token
const checkToken = (req, res) => {
    user = getUser(req)
    if (user) res.json({ authCode: authCodes.LOGGEDIN, username: user.username })
    else res.json({ authCode: authCodes.NOT_LOGGEDIN })
}

const updateUser = (req, res) => {
    user = getUser(req)
    //  TODO
}

module.exports =
{
    signup,
    login,
    logout,
    checkToken
}