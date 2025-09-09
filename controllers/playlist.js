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

router.get('/:playlistId/edit', async (req, res) => {

    try {

        const currentPlaylist = await Playlist.findById(req.params.playlistId)

        res.render('playlist/edit.ejs', {
            playlist: currentPlaylist,
        })

    } catch (err) {

        console.log(err)
        res.redirect('/')

    }
})

router.post('/', async (req, res) => {

    try{

        req.body.owner = req.session.user._id
        await Playlist.create(req.body)

        res.redirect(`/users/${req.session.user._id}/playlists`)

    } catch (err) {

        console.log(err)
        res.redirect('/')

    }
})

router.put('/:playlistId', async (req, res) => {

    try {
        const currentPlaylist = await Playlist.findById(req.params.playlistId)
        console.log(currentPlaylist)

        if (currentPlaylist.owner.equals(req.session.user._id)) {

            await currentPlaylist.updateOne(req.body)
            res.redirect(`/users/${req.session.user._id}/playlists`)

        } else {

            res.send('You don\'t have permission to do that.')

        }

    } catch (err) {

        console.log(err)
        res.redirect('/')

    }
})

router.delete('/:playlistId', async (req, res) => {

    try {

        const playlist = await Playlist.findById(req.params.playlistId)

        if (playlist.owner.equals(req.session.user._id)) {
            await playlist.deleteOne()
            res.redirect(`/users/${req.session.user._id}/playlists`)
        }

    } catch (err) {

        console.log(err)
        res.redirect('/')

    }
})

module.exports = router