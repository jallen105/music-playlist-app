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

router.get('/new', (req, res) => {
    res.render('playlist/new.ejs')
})

router.post('/', async (req, res) => {
    try{
        res.body.owner = req.session.user._id
        await Playlist.create(req.body)
        res.redirect(`users/${req.session.user._id}/playlists`)
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }

})

module.exports = router