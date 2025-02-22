const express = require("express")
const router = express.Router()
const editorController = require("../controllers/editor-controller")
const authMiddleware = require("../middlewares/auth-middleware")
const adminMiddleware = require("../middlewares/admin-middleware")

router
    .route("/update/:id")
    .patch(authMiddleware, adminMiddleware, editorController.updateEditor)

module.exports = router