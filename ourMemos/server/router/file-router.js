const express = require("express")
const router = express.Router()
const fileController = require("../controllers/file-controller")
const upload = require("../utilities/upload")

router
    .route("/upload")
    .post(upload.single('file'), fileController.uploadFile)

router
    .route("/:id")
    .get(fileController.downloadFile)

module.exports = router