import { useContext } from "react"
import { GlobalContext } from "../App"
import { NavLink, useLocation } from "react-router-dom";
import logoWhite from '../img/logo-white.png';
import URL from "../utils/URL";

export default function ()
{

    const {user, logout} = useContext (GlobalContext);

    const location = useLocation ();

    return (
        <header className="header">
            <nav className="nav nav--tours">
                <a className="nav__el" href='/'>All tours</a>
            </nav>
            <div className="header__logo">
                <img src={logoWhite} alt ='Natours Logo'/>
            </div>
            <nav className="nav nav--user">
                {user ? ( <>
                    <a className="nav__el nav__el--logout" onClick={logout}>Log out</a>
                    <NavLink className="nav__el" to="/account">
                        {user.photo && <img className="nav__user-img" src={`${URL}/img/users/${user.photo}`} alt={`Photo of ${user.name}`}/>}
                        <span>{user.name.split (' ')[0]}</span>
                    </NavLink> </>
                ) : (
                <>
                    <NavLink to='login' state={{from: location.pathname}} replace={true} className="nav__el" href="/login">Log in</NavLink>
                    <NavLink to='signup' state={{from: location.pathname}} replace={true} className="nav__el nav__el--cta" href="/signup">Sign up</NavLink>
                </>
                )}
            </nav>
        </header>
    )
}