import { NavLink } from "react-router-dom"
import { BiWorld } from "react-icons/bi"
import { FaUser } from "react-icons/fa"
import { FiLogOut } from "react-icons/fi"
import { MdOutlinePostAdd } from "react-icons/md"
import { MdGroups } from "react-icons/md"
import { MdGroupAdd } from "react-icons/md"
import { MdAdminPanelSettings } from "react-icons/md"
import { useAuth } from "../store/auth"

export const Navbar = () => {
    const { user } = useAuth()
    return (
        <>
            <header>
                    <div className="brand-name">
                        <h1>Our Memos</h1>
                    </div>
                    <nav>
                        <ul>
                            <li>
                                <NavLink to="/" title="Memos"><BiWorld size={32}/></NavLink>
                            </li>
                            <li>
                                <NavLink to="/mymemos" title="Profile"><FaUser size={32}/></NavLink>
                            </li>
                            {
                                user.isEditor? (<>
                                    <li>
                                        <NavLink to="/postmemo" title="Post Memos"><MdOutlinePostAdd size={32}/></NavLink>
                                    </li>
                                </>):(<></>)
                            }
                            <li>
                                <NavLink to="/groups" title="Groups"><MdGroups size={32}/></NavLink>
                            </li>
                            <li>
                                <NavLink to="/group/create" title="Create a Group"><MdGroupAdd size={32}/></NavLink>
                            </li>
                            {
                                user.isAdmin? (<>
                                    <NavLink to="/admin" title="Admin Panel"><MdAdminPanelSettings size={32} /></NavLink>
                                </>):(<></>)
                            }
                            <li>
                                <NavLink to="/logout" title="LogOut"><FiLogOut size={32}/></NavLink>
                            </li>
                        </ul>
                    </nav>
            </header>
        </>
    )
}