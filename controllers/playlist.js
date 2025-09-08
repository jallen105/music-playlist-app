const express = require('express')
const router = express.Router()

const Playlist = require('../models/playlist.js')

router.get('/', async (req, res) => {
    try {
        const  allPlaylists = await Playlist.find({}).populate('owner')
        res.render('playlist/index.ejs', {
            playlists: allPlaylists,
        })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

module.exports = router