const mongoose = require('mongoose')

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    artist: {
        type: String,
        required: true,
    },
    genre: String,
})

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    songList: [songSchema],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    favoredBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
})

const Playlist = mongoose.model('Playlist', playlistSchema)

module.exports = Playlist