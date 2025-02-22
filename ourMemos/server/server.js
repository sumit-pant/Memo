require('dotenv').config()
const express = require("express")
const app = express()
const cors = require("cors")
const authRouter = require("./router/auth-router")
const memoRouter = require("./router/memo-router")
const adminRouter = require("./router/admin-router")
const groupRouter = require("./router/group-router")
const fileRouter = require("./router/file-router")
const editorRouter = require("./router/editor-router")

const connectDB = require("./utilities/db")
const errorMiddleware = require("./middlewares/error-middleware")

const PORT = 3500

const corsOptions = {
    origin: process.env.FRONTEND_URI,
    methods: "GET, POST, PUT, PATCH, DELETE",
    credentials: true
}

app.use((cors(corsOptions)))

app.use(express.json())

app.use("/api/auth", authRouter)
app.use("/api/memos", memoRouter)
app.use("/api/admin", adminRouter)
app.use("/api/group", groupRouter)
app.use("/api/file", fileRouter)
app.use("/api/editor", editorRouter)

app.use(errorMiddleware)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at port: ${PORT}`)
    })
})