const express = require('express')
const router = express.Router({ mergeParams: true })

const Playlist = require('../models/playlist.js')
const session = require('express-session')

router.get('/new', async (req, res) => {
    console.log(req.params.playlistId)

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

router.get('/:songId/edit', async (req, res) => {

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

router.post('/', async (req, res) => {

    try {

        const currentPlaylist = await Playlist.findById(req.params.playlistId)

        if (currentPlaylist.owner.equals(req.session.user._id)) {

            if (req.body.title.trim() !== '' && req.body.artist.trim() !== '') {

                currentPlaylist.songList.push(req.body)
                await currentPlaylist.save()

                res.redirect(`/users/${req.session.user._id}/playlists/${currentPlaylist._id}/edit`)  

            } else {

                res.send('Please enter a valid title or artist name.')

            }

        } else {

            res.send('You don\'t have permission to do that.')

        }
    } catch (err) {

        console.log(err)
        res.redirect('/')

    }
})

router.put('/:songId', async (req, res) => {

    try {

        const currentPlaylist = await Playlist.findById(req.params.playlistId)
        const currentSong = currentPlaylist.songList.id(req.params.songId)

        if (currentPlaylist.owner.equals(req.session.user._id)) {

            if (req.body.title.trim() !== '' && req.body.artist.trim() !== '') {

                currentSong.set(req.body)
                await currentPlaylist.save()

                res.redirect(`/users/${req.session.user._id}/playlists/${currentPlaylist._id}/edit`)  

            } else {

                res.send('Please enter a valid title or artist name.')

            }

        } else {

            res.send('You don\'t have permission to do that.')

        }
    } catch (err) {

        console.log(err)
        res.redirect('/')

    }
})

router.delete('/:songId', async (req, res) => {

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