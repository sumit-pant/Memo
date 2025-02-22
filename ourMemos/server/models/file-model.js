const mongoose = require("mongoose")

const fileSchema = new mongoose.Schema({
    path: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
})

const File = mongoose.model("File", fileSchema)

module.exports = File