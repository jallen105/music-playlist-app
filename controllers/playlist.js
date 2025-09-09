const express = require('express')
const router = express.Router()

const Playlist = require('../models/playlist.js')
const session = require('express-session')

router.get('/', async (req, res) => {

    try {

        const allPlaylists = await Playlist.find({}).populate('owner')
        const allUserPlaylists = allPlaylists.filter((playlist) => playlist.owner.equals(req.session.user._id))

        res.render('playlist/index.ejs', {
            playlists: allUserPlaylists,
        })

    } catch (err) {

        console.log(err)
        res.redirect('/')

    }
})

router.get('/new', (req, res) => {

    res.render('playlist/new.ejs')

})

router.get('/:playlistId/song/new', async (req, res) => {

    try {

        const currentPlaylist = await Playlist.findById(req.params.playlistId)
        res.render('song/new.ejs', {
            playlist: currentPlaylist
        })

    } catch (err) {

        console.log(err)
        res.redirect('/')

    }
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

router.get('/:playlistId/song/:songId/edit', async (req, res) => {

    try {

        const currentPlaylist = await Playlist.findById(req.params.playlistId)
        const currentSong = currentPlaylist.songList.id(req.params.songId)

        res.render('song/edit.ejs', {

            playlist: currentPlaylist,
            song: currentSong,

        })

    } catch (err) {

        console.log(err)
        res.redirect('/')

    }
})

router.get('/:playlistId/', async (req, res) => {
    try {
        const currentPlaylist = await Playlist.findById(req.params.playlistId)

        res.render('playlist/show.ejs', {
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

router.post('/:playlistId/song', async (req, res) => {

    try {

        const currentPlaylist = await Playlist.findById(req.params.playlistId)

        currentPlaylist.songList.push(req.body)
        await currentPlaylist.save()

        res.redirect(`/users/${req.session.user._id}/playlists/${currentPlaylist._id}/edit`)

    } catch (err) {

        console.log(err)
        res.redirect('/')

    }
})

router.put('/:playlistId', async (req, res) => {

    try {
        const currentPlaylist = await Playlist.findById(req.params.playlistId)

        if (currentPlaylist.owner.equals(req.session.user._id)) {

            await currentPlaylist.updateOne(req.body)
            res.redirect(`/users/${req.session.user._id}/playlists/${currentPlaylist._id}`)

        } else {

            res.send('You don\'t have permission to do that.')

        }

    } catch (err) {

        console.log(err)
        res.redirect('/')

    }
})

router.put('/:playlistId/song/:songId', async (req, res) => {

    try {

        const currentPlaylist = await Playlist.findById(req.params.playlistId)
        const currentSong = currentPlaylist.songList.id(req.params.songId)

        currentSong.set(req.body)
        await currentPlaylist.save()

        res.redirect(`/users/${req.session.user._id}/playlists/${currentPlaylist._id}/edit`)

    } catch (err) {

        console.log(err)
        res.redirect('/')

    }
})


router.delete('/:playlistId', async (req, res) => {

    try {

        const currentPlaylist = await Playlist.findById(req.params.playlistId)

        if (currentPlaylist.owner.equals(req.session.user._id)) {
            await currentPlaylist.deleteOne()
            res.redirect(`/users/${req.session.user._id}/playlists/${currentPlaylist._id}`)
        } else {
            res.send('You don\'t have permission to do that.')
        }

    } catch (err) {

        console.log(err)
        res.redirect('/')

    }
})

router.delete('/:playlistId/song/:songId', async (req, res) => {

    try {

        const currentPlaylist = await Playlist.findById(req.params.playlistId)

        if (currentPlaylist.owner.equals(req.session.user._id)) {

            currentPlaylist.songList.id(req.params.songId).deleteOne()
            await currentPlaylist.save()

            res.redirect(`/users/${req.session.user._id}/playlists/${currentPlaylist._id}/edit`)

        } else {

            res.send('You don\'t have permission to do that.')

        }
    } catch (err) {

        console.log(err)
        res.redirect('/')

    }
})

module.exports = router