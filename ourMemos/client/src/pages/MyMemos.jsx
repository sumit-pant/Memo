import { useEffect, useState } from "react"
import { Navbar } from "../components/Navbar"
import { useAuth } from "../store/auth"
import { NavLink, Navigate } from "react-router-dom"
import { MdDelete } from "react-icons/md"

export const MyMemos = () => {
    const URI = import.meta.env.VITE_BACKEND_URI
    const { user, userAuthentication } = useAuth()
    const [isMemoAvl, setIsMemoAvl] = useState(true)
    const [isGroupMemoAvl, setIsGroupMemoAvl] = useState(true)
    const [memos, setMemos] = useState([])
    const [groupMemos, setGroupMemos] = useState([])
    const { isLoggedIn } = useAuth()
    const { authToken } = useAuth()
    if(!isLoggedIn) {
        return <Navigate to="/login" />
    }
    const deleteMemo = async (id) => {
        try {
            const response = await fetch(`${URI}/api/memos/mymemos/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: authToken
                }
            })
            if(response.ok){
                getAllMemos()
            }
        } catch (err) {
            console.log(`Error While Deleting Memo: ${err}`)
        }
    }
    const getAllMemos = async () => {
        try {
            const response = await fetch(`${URI}/api/memos/mymemos`, {
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

    const getAllGroupMemos = async () => {
        try {
            const response = await fetch(`${URI}/api/memos/mygroupmemos`, {
                method: "GET",
                headers: {
                    Authorization: authToken
                }
            })
            if (response.status === 404) {
                setIsGroupMemoAvl(false)
            }
            if (response.status === 200){
                setIsGroupMemoAvl(true)
                const data = await response.json()
                setGroupMemos(data.message)
            }
        } catch (err) {
            console.log(`Error while fetching the Group Memos: ${err}`)
        }
    }
    const deleteGroupMemo = async (id) => {
        try {
            const response = await fetch(`${URI}/api/memos/groupmemo/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: authToken
                }
            })
            if(response.ok){
                getAllGroupMemos()
            }
        } catch (err) {
            console.log(`Error While Deleting Memo: ${err}`)
        }
    }
    useEffect(() => {
        getAllMemos()
        userAuthentication()
        getAllGroupMemos()
    }, [])
        return (<>
            <Navbar />
            <div className="navspacer"></div>
            <main>
                <div className="profile-container">
                    <h2>My Profile</h2>
                    <div className="profile-details">
                        <p>Name: {user.username}</p>
                        <p>Email: {user.email}</p>
                        <p>Phone: {user.phone}</p>
                    </div>
                    <div className="profile-btn">
                        <NavLink to="/settings">Profile Settings</NavLink>
                    </div>
                </div>
                {!isMemoAvl? (
                <>
                    <div className="nomemo-container">
                    <h2>No Memo Found</h2>
                    <p>
                        Post your memo and show it to the world now...!!!
                    </p>
                    <NavLink to="/postmemo">Post Memo</NavLink>
                    </div>
                </>):(
                <>
                <div className="memos-container">
                <br></br>
                <br></br>
                    <h2>My Memos</h2>
                    <br></br>
                    {memos.map((currElem, index) => {
                        const { username, email, date, time, memo } = currElem
                        return (
                            <div className="memo-container" key={index}>
                                <div className="memo-details">
                                    <p>By {username}</p>
                                    <p>At {time}, {date}</p>
                                </div>
                                <div className="memo">
                                    <p>{memo}</p>
                                    <button className="memo-delete" onClick={() => deleteMemo(currElem._id)}>
                                        <MdDelete />
                                    </button>
                                </div>
                            </div>
                        )
                    }).reverse()}
                </div>
                </>)}
                {isGroupMemoAvl? (
                    <>
                        <div className="memos-container">
                            <h2>My Group Memos</h2>
                            <br></br>
                            {groupMemos.map((currElem, index) => {
                                const { username, email, date, time, memo } = currElem
                                return (
                                    <div className="memo-container" key={index}>
                                        <div className="memo-details">
                                            <p>By {username}</p>
                                            <p>At {time}, {date}</p>
                                        </div>
                                        <div className="memo">
                                            <p>{memo}</p>
                                            <button className="memo-delete" onClick={() => deleteGroupMemo(currElem._id)}>
                                                <MdDelete />
                                            </button>
                                        </div>
                                    </div>
                                )
                            }).reverse()}
                        </div>
                    </>
                ):(
                    <></>
                )}
            </main>
            </>
        )
}