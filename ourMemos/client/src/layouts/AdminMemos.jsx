import { useEffect, useState } from "react"
import { Navbar } from "../components/Navbar"
import { useAuth } from "../store/auth"
import { NavLink, Navigate, useParams } from "react-router-dom"
import { MdDelete } from "react-icons/md"

export const AdminMemos = () => {
    const URI = import.meta.env.VITE_BACKEND_URI
    const params = useParams()
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
            const response = await fetch(`${URI}/api/admin/memo/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: authToken
                }
            })
            if(response.ok){
                getUserMemos()
            }
        } catch (err) {
            console.log(`Error While Deleting Memo: ${err}`)
        }
    }

    const deleteGroupMemo = async (id) => {
        try {
            const response = await fetch(`${URI}/api/admin/memo/group/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: authToken
                }
            })
            if(response.ok){
                getUserGroupMemos()
            }
        } catch (err) {
            console.log(`Error While Deleting Memo: ${err}`)
        }
    }

    const getUserMemos = async () => {
        try {
            const response = await fetch(`${URI}/api/admin/user/${params.id}`, {
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

    const getUserGroupMemos = async () => {
        try {
            const response = await fetch(`${URI}/api/admin/user/group/${params.id}`, {
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
            console.log(`Error while fetching the Memos: ${err}`)
        }
    }

    useEffect(() => {
        getUserMemos()
        getUserGroupMemos()
        userAuthentication()
    }, [])
    return(<>
        <Navbar />
        <div className="navspacer"></div>
        <main>
        <h2>User Memos</h2>
        <br></br>
        {!isMemoAvl? (<>
            <div className="nomemo-container">
                <h2>No Memo Found</h2>
            </div>
        </>):(<>
            <div className="memos-container">
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
        <h2>Group Memos</h2>
        <br></br>
        {!isGroupMemoAvl? (<>
            <div className="nomemo-container">
                <h2>No Group Memo Found</h2>
            </div>
        </>):(<>
            <div className="memos-container">
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
        </>)}
        </main>
    </>)
}