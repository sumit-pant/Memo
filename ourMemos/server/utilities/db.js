const mongoose = require("mongoose")

const URI = process.env.MONGODB_URI

const connectDB = async () => {
    try {
        await mongoose.connect(URI)
        console.log("Connected to MongoDB")
    } catch (err) {
        console.log(`Error in Database Connection: ${err}`)
        process.exit(0)
    }
}

module.exports = connectDB