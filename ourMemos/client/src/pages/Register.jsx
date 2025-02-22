import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../store/auth"
import { toast } from "react-toastify"

export const Register = () => {
    const URI = import.meta.env.VITE_BACKEND_URI
    const { storeTokenInLS } = useAuth()
    const navigate = useNavigate()
    const [user, setUser] = useState({
        username: "",
        email: "",
        phone: "",
        password: ""
    })

    const handleInput = (e) => {
        let name = e.target.name
        let value = e.target.value
        setUser({
            ...user,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${URI}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })
            const res_data = await response.json()
            if(response.ok){
                storeTokenInLS(res_data.token)
                setUser({
                    username: "",
                    email: "",
                    phone: "",
                    password: ""
                })
                toast.success("Registration Successful")
                navigate("/")
            } else {
                toast.error(res_data.extraDetails? res_data.extraDetails : res_data.message)
            }
        } catch (err) {
            console.log(`Error while registration fetching: ${err}`)
        }
    }
    return (
        <>
            <header>
                    <div className="brand-name">
                        <h1>Our Memos</h1>
                    </div>
            </header>
            <div className="logospacer"></div>
            <main>
                <div className="registration-container">
                    <h2>Registration Form</h2>
               
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username">Name</label>
                        <input 
                            type="text"
                            name="username"
                            placeholder="Enter Your Name"
                            id="username"
                            required
                            autoComplete="off"
                            value={user.username}
                            onChange={handleInput}
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input 
                            type="text"
                            name="email"
                            placeholder="Enter Your Email"
                            id="email"
                            required
                            autoComplete="off"
                            value={user.email}
                            onChange={handleInput}
                        />
                    </div>
                    <div>
                        <label htmlFor="phone">Phone</label>
                        <input 
                            type="text"
                            name="phone"
                            placeholder="Enter Your Phone"
                            id="phone"
                            required
                            autoComplete="off"
                            value={user.phone}
                            onChange={handleInput}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password"
                            name="password"
                            placeholder="Enter Your Password"
                            id="password"
                            required
                            autoComplete="off"
                            value={user.password}
                            onChange={handleInput}
                        />
                    </div>
                    <button className="register-btn" type="submit">Register Now</button>
                </form>
                <div className="regLog">
                    <p>
                        Already a logged in user? <NavLink to="/login">Login..</NavLink>
                    </p>
                </div>
                </div>
            </main>
        </>
    )
}