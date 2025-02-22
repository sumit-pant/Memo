const express = require("express")
const router = express.Router()
const memoController = require("../controllers/memo-controller")
const memoValidSchema = require("../validators/memo-validator")
const validate = require("../middlewares/validate-middleware")
const authMiddleware = require("../middlewares/auth-middleware")

router
    .route("/")
    .get(memoController.getAllMemos)

router
    .route("/mymemos")
    .get(authMiddleware, memoController.getMyMemos)

router
    .route("/mymemos/delete/:id")
    .delete(authMiddleware, memoController.deleteMyMemo)

router
    .route("/postmemo")
    .post(validate(memoValidSchema), memoController.postMemo )

router
    .route("/like/:id")
    .patch(authMiddleware, memoController.updateLikes)

router
    .route("/comment/:id")
    .patch(authMiddleware, memoController.updateComments)

router 
    .route("/mygroupmemos")
    .get(authMiddleware, memoController.getMyGroupMemos)

router 
    .route("/groupmemo/delete/:id")
    .delete(authMiddleware, memoController.deleteMyGroupMemo)

router 
    .route("/search/:query")
    .get(authMiddleware, memoController.search)

module.exports = router