const User = require("../models/user-model")
const Memo = require("../models/memo-model")
const bcrypt = require("bcryptjs")

const home = async (req, res) => {
    try {
        res.status(200).send("Our Memos")
    } catch (err) {
        console.log(err)
    }
}

const register = async (req, res) => {
    try {
        const { username, email, phone, password } = req.body
        const userExist = await User.findOne({ email })
        if (userExist) {
            return res.status(400).json({ message: "Email Already Exist." })
        }
        const userCreated = await User.create({ username, email, phone, password })
        res.status(201).send({ 
            message: "Registration Successfull",
            token: await userCreated.generateToken(),
            userID: userCreated._id.toString()
        })
    } catch (err) {
        console.log(`Register-Controller Error: ${err}`)
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const userExist = await User.findOne({ email })
        if(!userExist) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }
        const user = await userExist.validatePassword(password)
        if (user) {
            res.status(200).json({
                message: "Login Successful",
                token: await userExist.generateToken(),
                userID: userExist._id.toString()
            })
        } else {
            res.status(401).json({ message: "Invalid Credentials" })
        }
    } catch (err) {
        res.status(500).json({ message: `Login-Controller Error: ${err}` })
    }
}

const user = async (req, res) => {
    try {
        const userData = req.user
        return res.status(200).json({ userData })
    } catch (err) {
        console.log(`Error from user route ${err}`)
    }
}

const getUserById = async (req, res) => {
    try {
        const id = req.params.id
        const userData = await User.findOne({ _id: id }, { password: 0 })
        return res.status(200).json({ userData })
    } catch (err) {
        console.log(`Error while getting user: ${err}`)
    }
}

const updateUser = async (req, res) => {
    try {
        const id = req.params.id
        const prevUsername = req.user.username
        const prevEmail = req.user.email
        const updatedData = req.body
        const updatedUsername = req.body.username
        const updatedEmail = req.body.email
        const updatedUser = await User.updateOne({_id: id}, {
            $set: updatedData
        })
        if (prevUsername != updatedUsername) {
            await Memo.updateMany({email: prevEmail}, {
                $set: {
                    username: updatedUsername,
                    email: updatedEmail
                }
            })
        }
        return res.status(200).json({updatedUser})
    } catch (err) {
        next(err)
    }
}

const changePassword = async (req, res) => {
    try {
        const id = req.params.id
        const { currPassword, newPassword } = req.body
        const userData = await User.findOne({ _id: id })
        const user = userData.validatePassword(currPassword)
        let hashPassword = ""
        if (user) {
            try {
                const saltRound = await bcrypt.genSalt(10)
                hashPassword = await bcrypt.hash(newPassword, saltRound)
            } catch (err) {
                console.log(`Error while hashing password: ${err}`)
            }
            const updatedPassword = await User.updateOne({ _id: id }, {
                $set: {
                    password: hashPassword
                }
            })
            res.status(200).json({updatedPassword})
        } else {
            return res.status(401).status({ message: "Invalid Password" })
        }
    } catch (err) {
        console.log(`Error while changing password: ${err}`)
    }
}

const deleteMyself = async (req, res) => {
    try {
        const id = req.params.id
        if (id == req.userID) {
            await User.deleteOne({ _id: id })
            return res.status(200).json({ message: "User Deleted Successfully." })
        }
        return res.status(401).json({ message: "You are not authorized to perform this action." })
    } catch (err) {
        console.log(`Error while deleting: ${err}`)
    }
}

module.exports = { home, register, login, user, updateUser, changePassword, deleteMyself, getUserById }