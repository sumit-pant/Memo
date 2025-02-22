const mongoose = require("mongoose")

const memoSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type:  String,
        required: true
    },
    date: {
        type:  String,
        required: true
    },
    time: {
        type:  String,
        required: true
    },
    memo: {
        type: String,
        required: true
    },
    fileName: {
        type: String
    },
    filePath: {
        type: String
    },
    likes: {
        type: Number,
        default: 0
    },
    likesByUsers: {
        type: Array,
        default: []
    },
    comments: {
        type: Number,
        default: 0
    },
    commentsByUsers: {
        type: Array,
        default: []
    }
})

memoSchema.index({ memo: 'text' })

const Memo = new mongoose.model("Memo", memoSchema)

module.exports = Memo