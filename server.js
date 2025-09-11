const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const session = require('express-session')
const path = require('path')

const authController = require('./controllers/auth.js')
const playlistController = require('./controllers/playlist.js')
const songController = require('./controllers/song.js')
const communityController = require('./controllers/community.js')

const isSignedIn = require('./middleware/is-signed-in.js')
const passUserToView = require('./middleware/pass-user-to-view.js')

const port = process.env.PORT

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
    console.log(`connected to MongoDB ${mongoose.connection.name}.`)
})

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')))

app.use(

    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })

)

app.use(passUserToView)

app.get('/', (req, res) => {
    
    res.render('index.ejs', {
        user: req.session.user,
    })

})


app.use('/auth', authController)
app.use('/community', communityController)
app.use(isSignedIn)
app.use('/users/:userId/playlists', playlistController)
app.use('/users/:userId/playlists/:playlistId/song', songController)

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}`)
})