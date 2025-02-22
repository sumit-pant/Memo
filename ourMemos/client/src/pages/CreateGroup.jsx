import { Navbar } from "../components/Navbar"
import { useAuth } from "../store/auth"
import { useState } from "react"
import { useNavigate, Navigate } from "react-router-dom"

export const CreateGroup = () => {
    const URI = import.meta.env.VITE_BACKEND_URI
    const { user, isLoggedIn, authToken, userAuthentication } = useAuth()
    const navigate = useNavigate()

    const [group, setGroup] = useState({
            "name": "",
            "description": ""
    })

    if(!isLoggedIn) {
        return <Navigate to="/login" />
    }
    
    const handleInput = (e) => {
        let name = e.target.name
        let value = e.target.value
        setGroup({
            ...group,
            [name]: value
        })
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${URI}/api/group/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken
                },
                body: JSON.stringify(group)
            })
            if(response.ok){
                setGroup({
                    name: "",
                    description: ""
                })
                const data = await response.json()
                const id = data.res_data._id
                navigate(`/group/addmembers/${id}`)
            }
        } catch (err) {
            console.log(`Error while creating group: ${err}`)
        }
    }


    return (
        <>
            <Navbar />
            <div className="navspacer"></div>
            <main>
                <h2>Create a Group</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="group-name">Group Name</label>
                        <input 
                            className="group-name"
                            type="text"
                            name="name"
                            placeholder="Enter Group Name"
                            id="name"
                            required
                            autoComplete="off"
                            value={group.name}
                            onChange={handleInput}
                        />
                    </div>
                    <div>
                        <label htmlFor="group-description">Group Description</label>
                        <textarea 
                            type="text"
                            name="description"
                            placeholder="Enter Group Description"
                            id="description"
                            required
                            autoComplete="off"
                            value={group.description}
                            onChange={handleInput}
                        />
                    </div>
                    <button className="post-btn" type="submit">Create</button>
                </form>
            </main>
        </>
    )
}