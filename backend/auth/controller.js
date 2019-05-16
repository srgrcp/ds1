const { authCodes, User, Token } = require('./models')
const sha1 = require('js-sha1')
const Resize = require('./../resize')

//  Get user from token
const getUser = async (req) =>{
    if(req.headers.authorization || req.body.token){
        tok = req.body.token || req.headers.authorization.split(' ')[1]
        var token = await Token.findById(tok)
        if (!token) return undefined
        token.updated = Date.now()
        await token.save()
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
    res.json({ authCode: authCodes.SIGNUP_OK, token: token.id })
}

const login = async (req, res) => {
    let user = await User.findOne({ username: req.body.username })
    if (!user)
        return res.json({ authCode: authCodes.USER_INCORRECT })
    if(sha1(req.body.password) != user.password)
        return res.json({ authCode: authCodes.WRONG_PASSWORD })
    let token = new Token({ user: user.id })
    await token.save()
    us = { username: user.username, email: user.email, avatar: user.avatar, address: user.address }
    res.json({ authCode: authCodes.LOGIN_OK, token: token.id, user: us })
}

const logout = async (req, res) => {
    if (getUser(req)) {
        await Token.findByIdAndDelete(req.body.token || req.headers.authorization.split(' ')[1])
        res.json({ authCode: authCodes.LOGOUT_OK })
    }
    else res.json({ authCode: authCodes.LOGOUT_ERROR })
}

//  Verificar que existe el token
const checkToken = async (req, res) => {
    console.log(req.body)
    user = await getUser(req)
    console.log(user)
    if (user) res.json({ authCode: authCodes.LOGGEDIN, user })
    else res.json({ authCode: authCodes.NOT_LOGGEDIN })
}

const updateUser =  async (req, res) => {
    user = await getUser(req)
    if (!user) return res.json({ authCode: authCodes.NOT_LOGGEDIN })
    udtUser = req.body
    if (udtUser.id != String(user.id)) return res.json({ authCode: authCodes.WRONG_USER })
    var username
    if (!udtUser.username) username = user.username
    else 
    {
        username = udtUser.username
        userq = await User.findOne({ username })
        if (userq && userq.id != user.id) return res.json({ authCode: authCodes.USER_EXISTS })
    }
    error = false
    if (udtUser.password) udtUser.password = sha1(udtUser.password)
    if (req.file){
        const imagePath = path.join(__dirname.substr(0, __dirname.length-5), '/dist/avatar')
        const fileUpload = new Resize(imagePath)
        udtUser.avatar = await fileUpload.save(req.file.buffer, username)
    }
    console.log(udtUser)
    await User.updateOne({ username: user.username }, udtUser, er => {
        if (er){
            console.log(er)
            res.json({ authCode: authCodes.DB_ERROR })
            error = true
        }
    })
    if (error) return
    udtUser = await User.findById(user.id)
    res.json({ authCode: authCodes.USER_UPDATED_OK, user: { username: udtUser.username, email: udtUser.email, avatar: udtUser.avatar, address: udtUser.address } })
}

module.exports =
{
    signup,
    login,
    logout,
    checkToken,
    updateUser,
    getUser
}