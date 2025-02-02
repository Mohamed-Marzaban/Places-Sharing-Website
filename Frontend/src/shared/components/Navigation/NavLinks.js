import { NavLink } from 'react-router-dom/cjs/react-router-dom.min'
import './NavLinks.css'
const NavLinks = props => {
    return <ul className='nav-links' >
        <li onClick={props.onClick}>
            <NavLink to="/" exact>ALL USERS</NavLink>
        </li>
        <li onClick={props.onClick}>
            <NavLink to="/u1/places">MY PLACES</NavLink>
        </li>
        <li onClick={props.onClick}>
            <NavLink to="/places/new">ADD PLACE</NavLink>
        </li>
        <li onClick={props.onClick}>
            <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
    </ul>
}
export default NavLinks