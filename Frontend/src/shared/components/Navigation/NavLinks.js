import { NavLink } from 'react-router-dom/cjs/react-router-dom.min'
import './NavLinks.css'
import AuthContext from '../../context/auth-context'
import { useContext } from 'react'
const NavLinks = props => {
    const auth = useContext(AuthContext)
    return <ul className='nav-links' >
        <li onClick={props.onClick}>
            <NavLink to="/" exact>ALL USERS</NavLink>
        </li>
        {auth.isLoggedIn && <li li onClick={props.onClick}>
            <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
        </li>
        }
        {auth.isLoggedIn && <li li onClick={props.onClick}>
            <NavLink to="/places/new">ADD PLACE</NavLink>
        </li>
        }
        {!auth.isLoggedIn && <li onClick={props.onClick}>
            <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>}
        {auth.isLoggedIn && <li onClick={props.onClick}>
            <button onClick={auth.logout}>LOGOUT</button>
        </li>}
    </ul >
}
export default NavLinks