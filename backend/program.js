require('./settings')
const authapi = require('./auth/api')
const storeapi = require('./store/api')

app.use('/api/auth', authapi)
app.use('/api', storeapi)
app.use(express.static('dist'))
app.use((req,res)=>{
    res.sendFile(path.join(__dirname+'/dist/index.html'))
})

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'))
})