import { useEffect, useState, useRef } from "react"
import { Navbar } from "../components/Navbar"
import { useAuth } from "../store/auth"
import { useNavigate, Navigate } from "react-router-dom"
import { GrAttachment } from "react-icons/gr"
import { uploadFile } from "../services/api"

export const PostMemo = () => {
    const URI = import.meta.env.VITE_BACKEND_URI
    const { user, userAuthentication } = useAuth()
    const [file, setFile] = useState('')
    const [filePath, setFilePath] = useState('')
    const [fileName, setFileName] = useState('')

    if(!user.isEditor){
        return <Navigate to="/" />
    }

    const fileInputRef = useRef()

    const onUploadClick = () => {
        fileInputRef.current.click()
    }

    const currDate = new Date().toLocaleDateString()
    const currTime = new Date().toLocaleTimeString()

    const navigate = useNavigate()

    const [memo, setMemo] = useState({
        username: user.username,
        email: user.email,
        date: currDate,
        time: currTime,
        memoInp: "",
        fileName: '',
        filePath: ''
    })
    const handleInput = (e) => {
        let name = e.target.name
        let value = e.target.value
        setMemo({
            username: user.username,
            email: user.email,
            date: currDate,
            time: currTime,
            fileName: fileName,
            filePath: filePath,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        memo.fileName = fileName
        memo.filePath = filePath
        try {
            const response = await fetch(`${URI}/api/memos/postmemo`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(memo)
            })
            if(response.ok){
                setMemo({
                    username: user.username,
                    email: user.email,
                    date: currDate,
                    time: currTime,
                    memoInp: "",
                    fileName: '',
                    filePath: ''
                })
                navigate("/")
            }
        } catch (err) {
            console.log(`Error while registration fetching: ${err}`)
        }
    }
    useEffect(() => {
        userAuthentication()
    }, [])

    useEffect(() => {
        const getFile = async () => {
            if (file){
                const data = new FormData()
                data.append("name", file.name)    
                data.append("file", file)
                let response = await uploadFile(data)
                setFilePath(response.path)
                setFileName(file.name)
            }
        }
        getFile()
    }, [file])
    return <>
        <Navbar />
        <div className="navspacer"></div>
        <main>
                <h2>Post Memo</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <textarea 
                            type="text"
                            name="memo"
                            placeholder="Enter Your Memo"
                            id="memo"
                            required
                            autoComplete="off"
                            value={memo.memoInp}
                            onChange={handleInput}
                        />
                    </div>
                    <button className="attach-btn" onClick={() => onUploadClick()} type="button"><GrAttachment /></button>
                    <br></br>
                    <p>{fileName}</p>
                    <input type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <br></br>
                    <button className="post-btn" type="submit">Post</button>
                </form>
        </main>
    </>
}