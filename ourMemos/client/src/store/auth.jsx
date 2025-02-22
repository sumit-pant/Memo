import { createContext, useContext, useEffect, useState } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const URI = import.meta.env.VITE_BACKEND_URI

    const [token, setToken] = useState(localStorage.getItem("token"))

    const [user, setUser] = useState("")

    const authToken = `Bearer ${token}`

    const storeTokenInLS = (serverToken) => {
        setToken(serverToken)
        return localStorage.setItem("token", serverToken)
    }

    let isLoggedIn = !!token

    const LogoutUser = () => {
        setToken("")
        return localStorage.removeItem("token")
    }

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
                setUser(data.userData)
            }
        } catch (err) {
            console.log(`Error fetching user data ${err}`)
        }
    }

    useEffect(() => {
        userAuthentication()
    }, [])

    return <AuthContext.Provider value={{ isLoggedIn, storeTokenInLS, LogoutUser, user, authToken, userAuthentication }}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => {
    const authContextValue = useContext(AuthContext)
    if(!authContextValue) {
        throw new Error ("useAuth is being used outside of the Provider")
    }
    return authContextValue
}