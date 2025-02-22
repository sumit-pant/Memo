const express = require("express")
const router = express.Router()
const adminController = require("../controllers/admin-controller")
const authMiddleware = require("../middlewares/auth-middleware")
const adminMiddleware = require("../middlewares/admin-middleware")
const memoController = require("../controllers/memo-controller")

router
    .route("/users")
    .get(authMiddleware, adminMiddleware, adminController.getAllUsers)

router
    .route("/user/:id")
    .get(authMiddleware, adminMiddleware, adminController.getUserMemos)

router
    .route("/user/group/:id")
    .get(authMiddleware, adminMiddleware, adminController.getUserGroupMemos)

router
    .route("/memo/delete/:id")
    .delete(authMiddleware, adminMiddleware, memoController.deleteMyMemo)

router
    .route("/memo/group/delete/:id")
    .delete(authMiddleware, adminMiddleware, memoController.deleteMyGroupMemo)

router
    .route("/user/delete/:id")
    .delete(authMiddleware, adminMiddleware, adminController.deleteUser)

router
    .route("/users/search/:query")
    .get(authMiddleware, adminMiddleware, adminController.search)

module.exports = router