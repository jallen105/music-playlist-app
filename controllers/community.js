const express = require('express')
const router = express.Router()

const Playlist = require('../models/playlist.js')
const session = require('express-session')

router.get('/', async (req, res) => {
    const allPlaylists = await Playlist.find({}).populate('owner')

    res.render('community/index.ejs', {
        playlists: allPlaylists,
    })
})

module.exports = router