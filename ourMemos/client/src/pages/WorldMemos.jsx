import { NavLink, Navigate, useNavigate } from "react-router-dom"
import { Navbar } from "../components/Navbar"
import { useAuth } from "../store/auth"
import { useEffect, useState } from "react"
import { AiTwotoneLike } from "react-icons/ai"
import { FaComment } from "react-icons/fa"
import { GiSelfLove } from "react-icons/gi"
import { MdDelete } from "react-icons/md"
import { IoMdDownload } from "react-icons/io"

export const WorldMemos = () => {
    const URI = import.meta.env.VITE_BACKEND_URI
    const navigate = useNavigate()
    const [isMemoAvl, setIsMemoAvl] = useState(true)
    const [memos, setMemos] = useState([])
    const [query, setQuery] = useState('')
    const { user, isLoggedIn, authToken, userAuthentication } = useAuth()

    const [memoID, setMemoID] = useState('')
    const [isLikeVisible, setIsLikeVisible] = useState('')

    const toggleVisibility = (id) => {
        if (memoID === id) {
            setMemoID('')
        } else {
            setMemoID(id)
        }
    }

    const showLikes = (id) => {
        if (isLikeVisible === id) {
            setIsLikeVisible('')
        } else {
            setIsLikeVisible(id)
        }
    }

    const currDate = new Date().toLocaleDateString()
    const currTime = new Date().toLocaleTimeString()

    const [comment, setComment] = useState({
        comment: ""
    })

    const handleQuery = (e) => {
        let value = e.target.value
        setQuery(value)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        navigate(`/search/${query}`)
    }

    const handleInput = (e) => {
        let name = e.target.name
        let value = e.target.value
        setComment({
            ...comment,
            [name]: value
        })
    }

    const postComment = (id) => async (e) => {
        e.preventDefault()
        let setCommentData = {
            commentData: [currDate, currTime, user._id, user.username, comment.comment]
        }
        try {
            const response = await fetch(`${URI}/api/memos/comment/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken
                },
                body: JSON.stringify(setCommentData)
            })
            if (response.ok) {
                setComment({
                    comment: ""
                })
                getAllMemos()
            }
        } catch(err) {
            console.log(`Error while setting comments: ${err}`)
        }
    }

    const deleteComment = async (id, comment) => {
        let setCommentData = {
            commentData: comment
        }
        try {
            const response = await fetch(`${URI}/api/memos/comment/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken
                },
                body: JSON.stringify(setCommentData)
            })
            if (response.ok) {
                setComment({
                    comment: ""
                })
                getAllMemos()
            }
        } catch(err) {
            console.log(`Error while deleting comment: ${err}`)
        }
    }

    if(!isLoggedIn) {
        return <Navigate to="/login" />
    }

    const getAllMemos = async () => {
        try {
            const response = await fetch(`${URI}/api/memos`, {
                method: "GET"
            })
            if (response.status === 404) {
                setIsMemoAvl(false)
            }
            if (response.status === 200){
                setIsMemoAvl(true)
                const data = await response.json()
                setMemos(data.message)
            }
        } catch (err) {
            console.log(`Error while fetching the Memos: ${err}`)
        }
    }

    const setLikes = async (id) => {
        try {
            let likeUser = {
                userID: [user._id, user.username]
            }
            await fetch(`${URI}/api/memos/like/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken
                },
                body: JSON.stringify(likeUser)
            })
            getAllMemos()
        } catch(err) {
            console.log(`Error while setting likes: ${err}`)
        }
    }

    useEffect(() => {
        getAllMemos()
        userAuthentication()
    }, [])

    if(!isMemoAvl){
        return (<>
            <Navbar />
            <div className="navspacer"></div>
            <main>
                <div className="nomemo-container">
                    <h2>No Memo Found</h2>
                    <p>
                        Post your memo and show it to the world now...!!!
                    </p>
                    <NavLink to="/postmemo">Post Memo</NavLink>
                </div>
            </main>
            </>
        )
    } else {
        return (<>
        <Navbar />
        <div className="navspacer"></div>
            <main>
                <form onSubmit={handleSearch} className="search-container">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search Memos"
                        id="search"
                        required
                        autoComplete="off"
                        value={query}
                        onChange={handleQuery}
                    />
                </form>
                <div className="memos-container">
                    {memos.map((currElem, index) => {
                        const { username, email, date, time, memo, likes, likesByUsers, comments, commentsByUsers, fileName, filePath } = currElem
                        return (
                            <div className="memo-container" key={index}>
                                <div className="memo-details">
                                    <p>By {username}</p>
                                    <p>At {time}, {date}</p>
                                </div>
                                <div className="memo">
                                    <p>{memo}</p>
                                </div>

                                { fileName === ''? (<></>):(<>
                                    <div className="downloadContainer">
                                        {fileName}
                                        <NavLink to={filePath} className={"download-btn"}><IoMdDownload /></NavLink>
                                    </div>
                                </>)}

                                <div className="likeComm">
                                    <div className="likes">
                                        <button className="likeNum" onClick={() => showLikes(currElem._id)}>{likes}</button>
                                        <button className="likeButton" onClick={() => setLikes(currElem._id)}>
                                            <AiTwotoneLike />
                                        </button>
                                    </div>
                                    <div className="comments">
                                        <button className="likeNum" onClick={() => toggleVisibility(currElem._id)}>{comments}</button>
                                        <button className="likeButton" onClick={() => toggleVisibility(currElem._id)}>
                                            <FaComment />
                                        </button>
                                    </div>
                                </div>
                                { isLikeVisible === currElem._id ? (
                                <div className="likesUsers">
                                    <p>Liked by:</p>
                                    { likes? (
                                        likesByUsers.map((currUser, num) => {
                                            return (
                                                <div className="userName" key={num}>
                                                    <GiSelfLove />
                                                    <p>{currUser[1]}</p>
                                                </div>
                                            )
                                        })
                                    ):(
                                        (
                                            <p>No Likes Found.</p>
                                        )
                                    )}
                                </div>
                                ):(
                                <></>
                                )}
                                { memoID === currElem._id ? (
                                <div className="commentBox">
                                    <form onSubmit={postComment(currElem._id)}>
                                        <div>
                                            <input 
                                                type="text"
                                                name="comment"
                                                placeholder="Enter Your Comment"
                                                id={currElem._id}
                                                required
                                                autoComplete="off"
                                                value={comment.comment}
                                                onChange={handleInput}
                                            />
                                        </div>
                                        <button className="login-btn" type="submit">Post</button>
                                    </form>
                                    <div className="comments-container">
                                        <p>Comments:</p>
                                        <br></br>
                                        { comments? (
                                            commentsByUsers.map((currComment, num) => {
                                                return (
                                                    <div className="commentContainer" key={num}>
                                                        <div className="comment-details">
                                                            <p>By {currComment[3]}</p>
                                                            <p>At {currComment[1]}, {currComment[0]}</p>
                                                        </div>
                                                        <div className="comment">
                                                            <p>{currComment[4]}</p>
                                                            { user._id === currComment[2] ? (
                                                                <button className="comment-delete" onClick={() => deleteComment(currElem._id, currComment)}>
                                                                    <MdDelete />
                                                                </button>
                                                            ): (
                                                                <></>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            }).reverse()
                                        ):(
                                            (
                                                <p>
                                                    No Comments Found.
                                                </p>
                                            )
                                        )}
                                    </div>
                                </div>
                                ):(
                                <></>)}
                            </div>
                        )
                    }).reverse()}
                </div>
            </main>
        </>)
    }   
}