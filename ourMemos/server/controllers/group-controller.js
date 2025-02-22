const Group = require("../models/group-model")
const GroupMemo = require("../models/groupmemo-model")

const createGroup = async (req, res) => {
    try {
        const name = req.body.name
        const description = req.body.description
        const adminID = req.user._id.toString()
        const adminName = req.user.username
        const adminEmail = req.user.email
        const initializedGroup = {
            name: name,
            description: description,
            groupAdmins: [[adminID, adminName, adminEmail]],
            groupMembers: [[adminID, adminName, adminEmail]]
        }
        const res_data = await Group.create(initializedGroup)
        return res.status(200).json({ res_data })
    } catch (err) {
        console.log(`error: ${err}`)
        return res.status(500).json({ message: "Group not created." })
    }
}

const getGroups = async (req, res) => {
    try {
        const id = req.user._id.toString()
        const response = await Group.find( { groupMembers: { $elemMatch: { 0: id } } })
        if(response.length === 0){
            return res.status(404).json({ message: "No Groups Found." })
        }
        return res.status(200).json({ message: response })
    } catch (err) {
        console.log(`Error while getting groups: ${err}`)
    }
}

const updateMembers = async (req, res) => {
    try {
        const id = req.params.id
        const jsonData = req.body
        const userID = jsonData.userID
        const user = await Group.findOne( { _id: id, groupMembers: { $elemMatch: { 0: userID[0] } } })
        if(user) {
            await Group.updateOne( { _id: id }, {
                $pull: { groupMembers: userID }
            })
            const members = await Group.findOne({ _id: id }, { groupMembers: 1 })
            await Group.updateOne({ _id: id }, {
                $set: { members: members.groupMembers.length }
            })
            return res.status(200).json({ message: `${userID} removed.` })
        } else {
            await Group.updateOne( { _id: id }, {
                $addToSet: { groupMembers: userID }
            })
            const members = await Group.findOne({ _id: id }, { groupMembers: 1 })
            await Group.updateOne({ _id: id }, {
                $set: { members: members.groupMembers.length }
            })
            return res.status(200).json({ message: `${userID} successfully added.` })
        }
    } catch(err) {
        console.log(`Error while processing members: ${err}`)
    }
}

const getGroupMembers = async (req, res) => {
    try {
        const id = req.params.id
        const members = await Group.findOne( { _id: id }, { groupMembers: 1 })
        return res.status(200).json({ message: members })
    } catch (err) {
        console.log(`Error while getting group members: ${err}`)
    }
}

const getGroupName = async (req, res) => {
    try {
        const id = req.params.id
        const groupName = await Group.findOne( { _id: id }, { name: 1 })
        return res.status(200).json({ message: groupName })
    } catch (err) {
        console.log(`Error while getting group members: ${err}`)
    }
}

const getGroupAdmins = async (req, res) => {
    try {
        const id = req.params.id
        const admins = await Group.findOne( { _id: id }, { groupAdmins: 1 })
        return res.status(200).json({ message: admins })
    } catch (err) {
        console.log(`Error while getting group admins: ${err}`)
    }
}

const deleteGroup = async (req, res) => {
    try {
        const id = req.params.id
        await Group.deleteOne({ _id: id })
        await GroupMemo.deleteMany({ groupID: id })
        return res.status(200).json({ message: "Group successfully deleted." })
    } catch (err) {
        console.log(`Error while deleting the Group: ${err}`)
    }
}

const search = async(req, res) => {
    try {
        const id = req.user._id.toString()
        const query = req.params.query
        if(!query){
            return res.status(400).json({ message: "query not provided." })
        }
        const response = await Group.find({ groupMembers: { $elemMatch: { 0: id } },
            $text: { $search: query },
        }, { score: { $meta: 'textScore' }}).sort({ score: { $meta: 'textScore' }})
        if(response.length === 0){
            return res.status(404).json({ message: "No Groups found that matches the query." })
        }
        return res.status(200).json({ message: response })
    } catch(err) {
        console.log(`Error while searching: ${err}`)
    }
}

module.exports = { createGroup, getGroups, updateMembers, getGroupMembers, getGroupAdmins, getGroupName, deleteGroup, search }