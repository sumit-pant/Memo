const Memo = require("../models/memo-model")
const GroupMemo = require("../models/groupmemo-model")

const getAllMemos = async (req, res) => {
    try {
        const response = await Memo.find()
        if(response.length === 0){
            return res.status(404).json({ message: "No Memos Found." })
        }
        return res.status(200).json({ message: response })
    } catch (err) {
        console.log(`Error while getting all Memos: ${err}`)
    }
}

const getMyMemos = async (req, res) => {
    try {
        const userEmail = req.user.email
        const response = await Memo.find({ email: userEmail })
        if(response.length === 0){
            return res.status(404).json({ message: "No Memos Found." })
        }
        return res.status(200).json({ message: response })
    } catch (err) {
        console.log(`Error while getting my Memos: ${err}`)
    }
}

const getMyGroupMemos = async (req, res) => {
    try {
        const userEmail = req.user.email
        const response = await GroupMemo.find({ email: userEmail })
        if(response.length === 0){
            return res.status(404).json({ message: "Memos not found." })
        }
        return res.status(200).json({ message: response })
    } catch (err) {
        console.log(`Error while getting my group memos: ${err}`)
    }
}

const postMemo = async (req, res) => {
    try {
        const response = req.body
        await Memo.create(response)
        return res.status(200).json({ message: "Memo Posted Successfully." })
    } catch (err) {
        return res.status(500).json({ message: "Memo not posted." })
    }
}

const deleteMyMemo = async (req, res) => {
    try {
        const id = req.params.id
        await Memo.deleteOne({ _id: id })
        return res.status(200).json({ message: "Memo Deleted Successfully" })
    } catch (err){
        next (err)
    }
}

const deleteMyGroupMemo = async (req, res) => {
    try {
        const id = req.params.id
        await GroupMemo.deleteOne({ _id: id })
        return res.status(200).json({ message: "Group Memo Deleted Successfully" })
    } catch(err){
        console.log(`Error while deleting group memo: ${err}`)
    }
}

const updateLikes = async (req, res) => {
    try {
        const id = req.params.id
        const jsonData = req.body
        const userID = jsonData.userID
        const user = await Memo.findOne( { _id: id, likesByUsers: { $elemMatch: { 0: userID[0] } } })
        if(user) {
            await Memo.updateOne( { _id: id }, {
                $pull: { likesByUsers: userID }
            })
            const likes = await Memo.findOne({ _id: id }, { likesByUsers: 1 })
            await Memo.updateOne({ _id: id }, {
                $set: { likes: likes.likesByUsers.length }
            })
            return res.status(200).json({ message: `${userID} removed.` })
        } else {
            await Memo.updateOne( { _id: id }, {
                $addToSet: { likesByUsers: userID }
            })
            const likes = await Memo.findOne({ _id: id }, { likesByUsers: 1 })
            await Memo.updateOne({ _id: id }, {
                $set: { likes: likes.likesByUsers.length }
            })
            return res.status(200).json({ message: `${userID} successfully added.` })
        }
    } catch(err) {
        console.log(`Error while processing likes: ${err}`)
    }
}

const updateComments = async(req, res) => {
    try {
        const id = req.params.id
        const jsonData = req.body
        const commentData = jsonData.commentData
        const comment = await Memo.findOne( { _id: id, commentsByUsers: commentData  })
        if(comment) {
            await Memo.updateOne( { _id: id }, {
                $pull: { commentsByUsers: commentData }
            })
            const comments = await Memo.findOne({ _id: id }, { commentsByUsers: 1 })
            await Memo.updateOne({ _id: id }, {
                $set: { comments: comments.commentsByUsers.length }
            })
            return res.status(200).json({ message: `${commentData} removed.` })
        } else {
            await Memo.updateOne( { _id: id }, {
                $addToSet: { commentsByUsers: commentData }
            })
            const comments = await Memo.findOne({ _id: id }, { commentsByUsers: 1 })
            await Memo.updateOne({ _id: id }, {
                $set: { comments: comments.commentsByUsers.length }
            })
            return res.status(200).json({ message: `${commentData} successfully added.` })
        }
    } catch(err) {
        console.log(`Error while processing comments: ${err}`)
    }
}

const search = async(req, res) => {
    try {
        const query = req.params.query
        if(!query){
            return res.status(400).json({ message: "query not provided." })
        }
        const response = await Memo.find({
            $text: { $search: query },
        }, { score: { $meta: 'textScore' }}).sort({ score: { $meta: 'textScore' }})
        if(response.length === 0){
            return res.status(404).json({ message: "No Memos found that matches the query." })
        }
        return res.status(200).json({ message: response })
    } catch(err) {
        console.log(`Error while searching: ${err}`)
    }
}

module.exports = { postMemo, getAllMemos, getMyMemos, deleteMyMemo, updateLikes, updateComments, getMyGroupMemos, deleteMyGroupMemo, search }