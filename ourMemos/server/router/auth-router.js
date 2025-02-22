const express = require("express")
const router = express.Router()
const controller = require("../controllers/auth-controller")
const { registerSchema, loginSchema } = require("../validators/auth-validator")
const validate = require("../middlewares/validate-middleware")
const authMiddleware = require("../middlewares/auth-middleware")

router.route("/").get(controller.home)

router.route("/user").get(authMiddleware, controller.user)

router
    .route("/getuser/:id")
    .get(authMiddleware, controller.getUserById)

router
    .route("/user/update/:id")
    .patch(authMiddleware, controller.updateUser)

router
    .route("/user/changepassword/:id")
    .patch(authMiddleware, controller.changePassword)

router
    .route("/user/delete/:id")
    .delete(authMiddleware, controller.deleteMyself)

router
    .route("/register")
    .post(validate(registerSchema), controller.register)

router
    .route("/login")
    .post(validate(loginSchema), controller.login)

module.exports = router