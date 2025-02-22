const GroupMemo = require("../models/groupmemo-model")

const getAllGroupMemos = async (req, res) => {
    try {
        const id = req.params.id
        const response = await GroupMemo.find({ groupID: id })
        if(response.length === 0){
            return res.status(404).json({ message: "No Memos Found." })
        }
        return res.status(200).json({ message: response })
    } catch (err) {
        console.log(`Error while getting all Memos: ${err}`)
    }
}

const postGroupMemo = async (req, res) => {
    try {
        const response = req.body
        await GroupMemo.create(response)
        return res.status(200).json({ message: "Memo Posted Successfully." })
    } catch (err) {
        return res.status(500).json({ message: "Memo not posted." })
    }
}

const updateGroupLikes = async (req, res) => {
    try {
        const id = req.params.id
        const jsonData = req.body
        const userID = jsonData.userID
        const user = await GroupMemo.findOne( { _id: id, likesByUsers: { $elemMatch: { 0: userID[0] } } })
        if(user) {
            await GroupMemo.updateOne( { _id: id }, {
                $pull: { likesByUsers: userID }
            })
            const likes = await GroupMemo.findOne({ _id: id }, { likesByUsers: 1 })
            await GroupMemo.updateOne({ _id: id }, {
                $set: { likes: likes.likesByUsers.length }
            })
            return res.status(200).json({ message: `${userID} removed.` })
        } else {
            await GroupMemo.updateOne( { _id: id }, {
                $addToSet: { likesByUsers: userID }
            })
            const likes = await GroupMemo.findOne({ _id: id }, { likesByUsers: 1 })
            await GroupMemo.updateOne({ _id: id }, {
                $set: { likes: likes.likesByUsers.length }
            })
            return res.status(200).json({ message: `${userID} successfully added.` })
        }
    } catch(err) {
        console.log(`Error while processing likes: ${err}`)
    }
}

const updateGroupComments = async(req, res) => {
    try {
        const id = req.params.id
        const jsonData = req.body
        const commentData = jsonData.commentData
        const comment = await GroupMemo.findOne( { _id: id, commentsByUsers: commentData  })
        if(comment) {
            await GroupMemo.updateOne( { _id: id }, {
                $pull: { commentsByUsers: commentData }
            })
            const comments = await GroupMemo.findOne({ _id: id }, { commentsByUsers: 1 })
            await GroupMemo.updateOne({ _id: id }, {
                $set: { comments: comments.commentsByUsers.length }
            })
            return res.status(200).json({ message: `${commentData} removed.` })
        } else {
            await GroupMemo.updateOne( { _id: id }, {
                $addToSet: { commentsByUsers: commentData }
            })
            const comments = await GroupMemo.findOne({ _id: id }, { commentsByUsers: 1 })
            await GroupMemo.updateOne({ _id: id }, {
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
        const id = req.params.id
        const query = req.params.query
        if(!query){
            return res.status(400).json({ message: "query not provided." })
        }
        const response = await GroupMemo.find({ groupID: id,
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

module.exports = { postGroupMemo, getAllGroupMemos, updateGroupLikes, updateGroupComments, search }