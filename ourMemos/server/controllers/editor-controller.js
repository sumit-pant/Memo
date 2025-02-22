const User = require("../models/user-model")

const updateEditor = async (req, res) => {
    try {
        const userID = req.params.id
        const status = await User.findOne({ _id: userID }, { isEditor: 1} )
        const editor = status.isEditor
        await User.updateOne({ _id: userID }, {
            $set: { isEditor: !editor }
        })
        return res.status(200).json({ msg: "Editor Role Updated" })
    } catch (err) {
        console.log(`Error while updating editor: ${err}`)
    }
}

module.exports = { updateEditor }