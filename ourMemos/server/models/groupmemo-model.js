const mongoose = require("mongoose")

const groupMemoSchema = new mongoose.Schema({
    groupID: {
        type: String,
        required: true
    },
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

groupMemoSchema.index({ memo: 'text' })

const GroupMemo = new mongoose.model("GroupMemo", groupMemoSchema)

module.exports = GroupMemo