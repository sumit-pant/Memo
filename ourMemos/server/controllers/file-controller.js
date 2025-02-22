const File = require("../models/file-model")

const uploadFile = async (req, res) => {
    const fileObj = {
        path: req.file.path,
        name: req.file.originalname
    }
    try {
        const file = await File.create(fileObj)
        return res.status(200).json({ path: `http://localhost:3500/api/file/${file._id}`})
    } catch (err) {
        console.log(`Error while uploading file: ${err}`)
    }
}

const downloadFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id)
        res.download(file.path, file.name)
    } catch (err) {
        console.log(`Error while downloading file: ${err}`)
    }
}

module.exports = { uploadFile, downloadFile }