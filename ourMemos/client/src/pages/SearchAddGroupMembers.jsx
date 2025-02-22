import { Navbar } from "../components/Navbar"
import { useAuth } from "../store/auth"
import { useEffect, useState } from "react"
import { useParams, NavLink, useNavigate } from "react-router-dom"
import { HiUserAdd, HiUserRemove } from "react-icons/hi"

export const SearchAddGroupMembers = () => {
    const URI = import.meta.env.VITE_BACKEND_URI
    const { user, isLoggedIn, authToken, userAuthentication } = useAuth()
    const [users, setUsers] = useState([])
    const params = useParams()
    const navigate = useNavigate()
    const [query, setQuery] = useState('')
    const [groupMembers, setGroupMembers] = useState([])
    const [groupAdmins, setGroupAdmins] = useState([])

    const handleQuery = (e) => {
        let value = e.target.value
        setQuery(value)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        navigate(`/group/addmembers/${params.id}/search/${query}`)
    }

    const isGroupAdmin = () => {
        const userDetails = [user._id, user.username, user.email]
        const doesExist = groupAdmins.some(
            (userInfo) => 
                userInfo.length === userDetails.length &&
                userInfo.every((value, index) => value === userDetails[index])
        )
        return doesExist
    }

    const getAllUsers = async () => {
        try {
            const response = await fetch(`http://localhost:3500/api/group/searchusers/${params.query}`, {
                method: "GET",
                headers: {
                    Authorization: authToken
                }
            })
            const data = await response.json()
            setUsers(data)
        } catch (err) {
            console.log(`Error while fetching users: ${err}`)
        }
    }

    const setMember = async (member) => {
        try {
            let memberDetails = {
                userID: [member._id, member.username, member.email]
            }
            await fetch(`${URI}/api/group/updatemember/${params.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken
                },
                body: JSON.stringify(memberDetails)
            })
            getAllUsers()
            getGroupMembers()
        } catch(err) {
            console.log(`Error while setting members: ${err}`)
        }
    }

    const leaveGroup = async () => {
        try {
            const userDetails = {
                userID: [user._id, user.username, user.email]
            }
            await fetch(`${URI}/api/group/updatemember/${params.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken
                },
                body: JSON.stringify(userDetails)
            })
            navigate("/groups")
        } catch(err) {
            console.log(`Error while leaving group: ${err}`)
        }
    }

    const deleteGroup = async () => {
        try {
            await fetch(`${URI}/api/group/delete/${params.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: authToken
                }
            })
            navigate("/groups")
        } catch (err) {
            console.log(`Error while deleting group: ${err}`)
        }
    }

    const getGroupMembers = async () => {
        try {
            const response = await fetch(`${URI}/api/group/members/${params.id}`, {
                method: "GET",
                headers: {
                    Authorization: authToken
                }
            })
            const data = await response.json()
            setGroupMembers(data.message.groupMembers)
        } catch (err) {
            console.log(`Error while getting group members: ${err}`)
        }
    }

    const memberExists = (member) => {
        const memberDetails = [member._id, member.username, member.email]
        const doesExist = groupMembers.some(
            (userInfo) => 
                userInfo.length === memberDetails.length &&
                userInfo.every((value, index) => value === memberDetails[index])
        )
        return doesExist
    }

    const getGroupAdmins = async () => {
        try {
            const response = await fetch(`${URI}/api/group/admins/${params.id}`, {
                method: "GET",
                headers: {
                    Authorization: authToken
                }
            })
            if(response.ok){
                const data = await response.json()
                setGroupAdmins(data.message.groupAdmins)
            }
        } catch (err) {
            console.log(`Error while getting group admins: ${err}`)
        }
    }

    const adminExists = (member) => {
        const memberDetails = [member._id, member.username, member.email]
        const doesExist = groupAdmins.some(
            (userInfo) => 
                userInfo.length === memberDetails.length &&
                userInfo.every((value, index) => value === memberDetails[index])
        )
        return doesExist
    }

    useEffect(() => {
        getAllUsers()
        userAuthentication()
        getGroupMembers()
        getGroupAdmins()
        isGroupAdmin()
    }, [])

    useEffect(() => {
        getAllUsers()
    }, [params.query])

    return (
        <>
            <Navbar />
            <div className="navspacer"></div>
            {isGroupAdmin()? (<>
                <form onSubmit={handleSearch} className="search-container">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search Users"
                        id="search"
                        required
                        autoComplete="off"
                        value={query}
                        onChange={handleQuery}
                    />
                </form>
            </>):(<></>)}
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        {isGroupAdmin()?(
                            <th>Member</th>
                        ):(
                            <></>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {isGroupAdmin()?(<>
                        {users.map((currUser, index) => {
                        return <tr key={index}>
                            {adminExists(currUser)?(
                                <>
                                    <td>{ currUser.username }</td>
                                    <td>{ currUser.email }</td>
                                    {isGroupAdmin()?(
                                        <td><p>Group Admin</p></td>
                                    ):(
                                        <></>
                                    )}
                                </>
                            ):(
                                <>
                                    <td>{ currUser.username }</td>
                                    <td>{ currUser.email }</td>
                                    {isGroupAdmin()?(
                                        <td>
                                        {memberExists(currUser) ? (
                                            <button onClick={() => setMember(currUser)} className="remove-user">
                                                <HiUserRemove />
                                            </button>
                                        ):(
                                            <button onClick={() => setMember(currUser)} className="add-user">
                                                <HiUserAdd />
                                            </button>
                                        )}
                                    </td>
                                    ):(
                                        <></>
                                    )}
                                        </>
                                    )}
                                </tr>
                            })}
                    </>):(<>
                        {groupMembers.map((currMem, num) => {
                            return <tr key={num}>
                                <td>{currMem[1]}</td>
                                <td>{currMem[2]}</td>
                            </tr>
                        })}
                    </>)}
                </tbody>
            </table>
            <div className="members-buttons">
                <button className="login-btn" onClick={() => {navigate(`/group/${params.id}`)}} >
                    View Group
                </button>
                    {isGroupAdmin()? (<>
                        <button className="delete-btn-settings" onClick={() => deleteGroup()}>
                            Delete Group
                        </button>
                    </>):(
                        <>
                            <button className="delete-btn-settings" onClick={() => leaveGroup()}>
                                Leave Group
                            </button>
                        </>
                    )}
            </div>
        </>
    )
}