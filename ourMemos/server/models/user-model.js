const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Memo = require("../models/memo-model")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isEditor: {
        type: Boolean,
        default: false
    }
})

userSchema.index({ username: 'text', email: 'text' })

userSchema.pre('save', async function (next) {
    const user = this
    if(!user.isModified("password")) {
        next()
    }
    try {
        const saltRound = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(user.password, saltRound)
        user.password = hashPassword
    } catch (err) {
        next(err)
    }
})

userSchema.methods.newPasswordChange = async function (password) {
    try {
        const saltRound = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, saltRound).then((hashPassword) => {
            return hashPassword
        })
    } catch (err) {
        console.log(`error while hashing password: ${err}`)
    }
}

userSchema.methods.validatePassword = async function (password){
    return bcrypt.compare(password, this.password)
}

userSchema.methods.generateToken = async function () {
    try {
        return jwt.sign({
            userID: this._id.toString(),
            email: this.email,
            isAdmin: this.isAdmin
        },
            process.env.JWT_SECRET_KEY,
        {
            expiresIn: "30d"
        }
        )
    } catch (err) {
        console.log(`Error while Generating Token: ${err}`)
    }
}

const User = new mongoose.model("User", userSchema)

module.exports = User