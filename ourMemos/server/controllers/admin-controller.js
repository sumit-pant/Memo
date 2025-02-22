const User = require("../models/user-model")
const Memo = require("../models/memo-model")
const GroupMemo = require("../models/groupmemo-model")
const Group = require("../models/group-model")

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 })
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No Users Found" })
        }
        return res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

const getUserMemos = async (req, res) => {
    try {
        const userID = req.params.id
        const data = await User.findOne({ _id: userID }, { password: 0 })
        const userEmail = data.email
        const response = await Memo.find({ email: userEmail })
        if(response.length === 0){
            return res.status(404).json({ message: "No Memos Found." })
        }
        return res.status(200).json({ message: response })
    } catch (err) {
        console.log(`Error while getting user memos: ${err}`)
    }
}

const getUserGroupMemos = async (req, res) => {
    try {
        const userID = req.params.id
        const data = await User.findOne({ _id: userID }, { password: 0 })
        const userEmail = data.email
        const response = await GroupMemo.find({ email: userEmail })
        if(response.length === 0){
            return res.status(404).json({ message: "No Memos Found." })
        }
        return res.status(200).json({ message: response })
    } catch (err) {
        console.log(`Error while getting user group memos: ${err}`)
    }
}

const deleteUser = async (req, res) => {
    try {
        const userID = req.params.id
        await Memo.updateMany( { likesByUsers: { $elemMatch: { 0: userID } } }, {
            $pull: { likesByUsers: { $in: [userID] } },
            $inc: { likes: -1 }
        })
        await GroupMemo.updateMany( { likesByUsers: { $elemMatch: { 0: userID } } }, {
            $pull: { likesByUsers: { $in: [userID] } },
            $inc: { likes: -1 }
        })
        await Memo.updateMany( { commentsByUsers: { $elemMatch: { 2: userID } } }, {
            $pull: { commentsByUsers: { $in: [userID] } },
            $inc: { comments: -1 }
        })
        await GroupMemo.updateMany( { commentsByUsers: { $elemMatch: { 2: userID } } }, {
            $pull: { commentsByUsers: { $in: [userID] } },
            $inc: { comments: -1 }
        })
        await Group.updateMany( { groupMembers: { $elemMatch: { 0: userID } } }, {
            $pull: { groupMembers: { $in: [userID] } },
            $inc: { members: -1 }
        })
        await User.deleteOne({ _id: userID })
        return res.status(200).json({ message: "User Deleted Successfully" })
    } catch (err) {
        console.log(`Error while deleting user: ${err}`)
    }
}

const search = async(req, res) => {
    try {
        const query = req.params.query
        if(!query){
            return res.status(400).json({ message: "query not provided." })
        }
        const users = await User.find({
            $text: { $search: query },
        }, { password: 0, score: { $meta: 'textScore' }}).sort({ score: { $meta: 'textScore' }})
        if(users.length === 0){
            return res.status(404).json({ message: "No Users found that matches the query." })
        }
        return res.status(200).json(users)
    } catch(err) {
        console.log(`Error while searching: ${err}`)
    }
}

module.exports = { getAllUsers, getUserMemos, deleteUser, getUserGroupMemos, search }