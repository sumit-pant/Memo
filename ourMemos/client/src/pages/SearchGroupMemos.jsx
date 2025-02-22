import { NavLink, Navigate, useParams, useNavigate } from "react-router-dom"
import { Navbar } from "../components/Navbar"
import { useAuth } from "../store/auth"
import { useEffect, useState } from "react"
import { AiTwotoneLike } from "react-icons/ai"
import { FaComment } from "react-icons/fa"
import { GiSelfLove } from "react-icons/gi"
import { MdDelete } from "react-icons/md"
import { TfiWrite } from "react-icons/tfi"
import { FaPeopleGroup } from "react-icons/fa6"
import { IoMdDownload } from "react-icons/io"

export const SearchGroupMemos = () => {
    const URI = import.meta.env.VITE_BACKEND_URI
    const params = useParams()
    const navigate = useNavigate()
    const [isMemoAvl, setIsMemoAvl] = useState(true)
    const [memos, setMemos] = useState([])
    const [query, setQuery] = useState('')
    const { user, isLoggedIn, authToken, userAuthentication } = useAuth()
    const [groupName, setGroupName] = useState('')

    const [memoID, setMemoID] = useState('')
    const [isLikeVisible, setIsLikeVisible] = useState('')

    const handleQuery = (e) => {
        let value = e.target.value
        setQuery(value)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        navigate(`/group/${params.id}/search/${query}`)
    }

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
            const response = await fetch(`${URI}/api/group/memo/comment/${id}`, {
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
            const response = await fetch(`${URI}/api/group/memo/comment/${id}`, {
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

    const getGroupName = async () => {
        try {
            const response = await fetch(`${URI}/api/group/name/${params.id}`, {
                method: "GET",
                headers: {
                    Authorization: authToken
                }
            })
            if (response.ok){
                const data = await response.json()
                setGroupName(data.message.name)
            }
        }catch (err){
            console.log(`Error while fetching group name: ${err}`)
        }
    }
 
    const getAllMemos = async () => {
        try {
            const response = await fetch(`${URI}/api/group/${params.id}/search/${params.query}`, {
                method: "GET",
                headers: {
                    Authorization: authToken
                }
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
            await fetch(`${URI}/api/group/memo/like/${id}`, {
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
        userAuthentication()
        getGroupName()
        getAllMemos()
    }, [])

    useEffect(() => {
        getAllMemos()
    }, [params.query])

    if(!isMemoAvl){
        return (<>
        <Navbar />
        <div className="navspacer"></div>
        {/* <Navbar /> */}
            <main>
                <div className="group-heading">
                    <h2>
                        {groupName}
                    </h2>
                    <div className="group-details">
                        <NavLink to={`/group/post/${params.id}`}><TfiWrite /></NavLink>
                        <NavLink to={`/group/addmembers/${params.id}`}><FaPeopleGroup /></NavLink>
                    </div>
                </div>
                <div className="nomemo-container">
                    <h3>No Memos Found.</h3>
                    <p>
                        Post your memo to this group...
                    </p>
                </div>
            </main>
            </>
        )
    } else {
        return (<>
        <Navbar />
        <div className="navspacer"></div>
            <main>
                <div className="group-heading">
                    <h2>
                        {groupName}
                    </h2>
                    <div className="group-details">
                        <NavLink to={`/group/post/${params.id}`}><TfiWrite /></NavLink>
                        <NavLink to={`/group/addmembers/${params.id}`}><FaPeopleGroup /></NavLink>
                    </div>
                </div>
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
                                        <NavLink to={filePath}><IoMdDownload /></NavLink>
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