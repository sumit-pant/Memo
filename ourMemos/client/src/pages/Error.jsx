import { NavLink } from "react-router-dom"
import { Navbar } from "../components/Navbar"

export const Error = () => {
    return <>
        <Navbar />
        <div className="navspacer"></div>
        <main>
            <div className="error-container">
                <h2>404 Error</h2>
                <div className="memo-container">
                <p>
                    Oops! It looks like the page you are looking for does not exist. Press the button given below to go to homepage.
                </p>
                <br></br>
                <NavLink to="/">HomePage</NavLink>
                </div>
            </div>
        </main>
    </>
}