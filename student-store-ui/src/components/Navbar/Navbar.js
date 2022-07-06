import { Link } from "react-router-dom"
import logo from "../../assets/codepath.svg"
import Twitter from "../Icons/Twitter"
import Instagram from "../Icons/Instagram"
import Facebook from "../Icons/Facebook"
import { useNavigate } from "react-router-dom"
import apiClient from "../../services/apiClient"


import "./Navbar.css"

export default function Navbar({user, setUser, setError}) {
  
  const navigate = useNavigate()

  const handleLogout = async () => {
    await apiClient.logoutUser()
    setUser({})
    setError(null)
    navigate("/")
  }

  return (
    <nav className="Navbar">
      <div className="content">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="codepath logo" />
          </Link>
        </div>

        <div className="socials">
          <Twitter fill="var(--pure-white)" />
          <Instagram fill="var(--pure-white)" />
          <Facebook fill="var(--pure-white)" />
        </div>

        <ul className="links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/#About">About Us</Link>
          </li>
          <li>
            <Link to="/#Contact">Contact Us</Link>
          </li>
          <li>
            <Link to="/#Buy">Buy Now</Link>
          </li>
          {user?.email? null : <li>
            <Link to="/login">
              Login
            </Link>
          </li>}
          {user?.email?<li onClick={handleLogout} className="logout">
              Logout
          </li> : null}

          {user?.email ? null :<li>
            <Link to="/signup">
                Register
            </Link>
          </li>}
        </ul>
      </div>
    </nav>
  )
}
