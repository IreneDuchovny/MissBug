const { NavLink } = ReactRouterDOM
const {  useEffect,useState } = React

import { UserMsg } from './user-msg.jsx'
import {LoginSignup} from './login-signup.jsx'
import { userService } from '../services/user.Service.js'

export function AppHeader() {
    const [user, setUser] = useState(userService.getLoggedinUser())

    function onChangeLoginStatus(user) {
        setUser(user)
    }
    function onLogout() {
        userService.logout()
            .then(()=>{
                setUser(null)
            })
    }
    // useEffect(() => {
    //     // component did mount when dependancy array is empty
    // }, [])

    return (
        <header>
            <UserMsg />
            <div className="main-nav">
            <h2 className="bugs-header">Bugs are Forever</h2>
            <nav>
                <NavLink to="/">Home</NavLink> |
                <NavLink to="/bug">Bugs</NavLink> |
                <NavLink to="/about">About</NavLink>
            </nav>
            </div>
            {user ? (
                < section className="user-login-greet" >
                    <div className="greet-user">Hello {user.fullname}</div>
                    <button className="logout-btn" onClick={onLogout}>Logout</button>
                </ section >
            ) : (
                <section>
                    <LoginSignup onChangeLoginStatus={onChangeLoginStatus} />
                </section>
            )}
           
        </header>
    )
}
