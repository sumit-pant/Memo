import { Navigate } from "react-router-dom"
import { Navbar } from "../components/Navbar"
import { useAuth } from "../store/auth"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const Settings = () => {
    const URI = import.meta.env.VITE_BACKEND_URI
    const { isLoggedIn } = useAuth()
    const { authToken } = useAuth()
    const navigate = useNavigate()
    const { LogoutUser } = useAuth()

    const [profile, setProfile] = useState({
        username: "",
        email: "",
        phone: ""
    })

    const [password, setPassword] = useState({
        currPassword: "",
        newPassword: ""
    })

    const userAuthentication = async () => {
        try {
            const response = await fetch(`${URI}/api/auth/user`, {
                method: "GET",
                headers: {
                    Authorization: authToken
                }
            })
            if (response.ok) {
                const data = await response.json()
                setProfile(data.userData)
            }
        } catch (err) {
            console.log(`Error fetching user data ${err}`)
        }
    }

    const handleInput = (e) => {
        let name = e.target.name
        let value = e.target.value
        setProfile({
            ...profile,
            [name]: value
        })
        setPassword({
            ...password,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${URI}/api/auth/user/update/${profile._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken
                },
                body: JSON.stringify(profile)
            })
        } catch (err) {
            console.log(`Error while updating data: ${err}`)
        }
    }

    const handlePassword = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${URI}/api/auth/user/changepassword/${profile._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken
                },
                body: JSON.stringify(profile)
            })
        } catch (err) {
            console.log(`Error while changing password: ${err}`)
        }
    }

    const handleDelete = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${URI}/api/auth/user/delete/${profile._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken
                }
            })
            LogoutUser()
            navigate("/login")
        } catch (err) {
            console.log(`Error while Deleting: ${err}`)
        }
    }

    useEffect(() => {
        userAuthentication()
    }, [])

    if(!isLoggedIn) {
        return <Navigate to="/login" />
    }

    return <>
        <Navbar />
        <div className="navspacer"></div>
            <main>
                    <h2>Profile Settings</h2>
                
                
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username">Name</label>
                        <input 
                            className="group-name"
                            type="text"
                            name="username"
                            placeholder="Enter Your Name"
                            id="username"
                            required
                            autoComplete="off"
                            value={profile.username}
                            onChange={handleInput}
                        />
                    </div>
                    <div>
                        <label htmlFor="phone">Phone</label>
                        <input 
                            className="group-name"
                            type="text"
                            name="phone"
                            placeholder="Enter Your Phone"
                            id="phone"
                            required
                            autoComplete="off"
                            value={profile.phone}
                            onChange={handleInput}
                        />
                    </div>
                    <button className="register-btn" type="submit">Update</button>
                </form>
                <h2>Change Your Password</h2>
                <form onSubmit={handlePassword}>
                <div>
                    <label htmlFor="currPassword">Current Password</label>
                        <input
                            className="group-name" 
                            type="password"
                            name="currPassword"
                            placeholder="Enter Your Current Password"
                            id="currPassword"
                            required
                            autoComplete="off"
                            onChange={handleInput}
                        />
                    </div>
                    <div>
                    <label htmlFor="newPassword">New Password</label>
                        <input 
                            className="group-name"
                            type="password"
                            name="newPassword"
                            placeholder="Enter Your New Password"
                            id="newPassword"
                            required
                            autoComplete="off"
                            onChange={handleInput}
                        />
                    </div>
                    <button className="register-btn" type="submit">Change</button>
                </form>
                <h2>Delete Your Account</h2>
                <form onSubmit={handleDelete}>
                   <button className="delete-btn-settings" type="submit">Delete</button>
                </form>
            </main>
    </>
}