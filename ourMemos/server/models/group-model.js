const mongoose = require("mongoose")

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    groupAdmins: {
        type: Array,
        default: []
    },
    groupMembers: {
        type: Array,
        default: []
    },
    members: {
        type: Number,
        default: 1
    }
})

groupSchema.index({ name: 'text', description: 'text' })

const Group = new mongoose.model("Group", groupSchema)

module.exports = Group