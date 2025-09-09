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

router.get('/:playlistId', async (req, res) => {
    const currentPlaylist = await Playlist.findById(req.params.playlistId).populate('owner')

    res.render('community/show.ejs', {
        playlist: currentPlaylist
    })
})

module.exports = router