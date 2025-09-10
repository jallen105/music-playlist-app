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

    if (req.session.user) {

        const userHasFavored = currentPlaylist.favoredBy.some((user) => user.equals(req.session.user._id))    
        
        res.render('community/show.ejs', {
        playlist: currentPlaylist,
        favored: userHasFavored,
    })

    } else {
        res.render('community/show.ejs', {
        playlist: currentPlaylist,
        favored: false,
    })  
    }



})

router.post('/:playlistId/favored-by/:userId', async (req, res) => {

    try {

        await Playlist.findByIdAndUpdate(req.params.playlistId, {
            $push: { favoredBy: req.params.userId }
        })

        res.redirect(`/community/${req.params.playlistId}`)

    } catch (err) {

        console.log(err)
        res.redirect('/')

    }
})

router.delete('/:playlistId/favored-by/:userId', async (req, res) => {
    
    try {

        await Playlist.findByIdAndUpdate(req.params.playlistId, {
            $pull: { favoredBy: req.params.userId },
        })

        res.redirect(`/community/${req.params.playlistId}`)

    } catch (err) {

        console.log(err)
        res.redirect('/')

    }
})

module.exports = router