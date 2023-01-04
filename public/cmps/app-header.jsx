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
            <nav>
                <NavLink to="/">Home</NavLink> |
                <NavLink to="/bug">Bugs</NavLink> |
                <NavLink to="/about">About</NavLink>
            </nav>
            {user ? (
                < section >
                    <h2>Hello {user.fullname}</h2>
                    <button onClick={onLogout}>Logout</button>
                </ section >
            ) : (
                <section>
                    <LoginSignup onChangeLoginStatus={onChangeLoginStatus} />
                </section>
            )}
            <h1 className="bugs-header">Bugs are Forever</h1>
        </header>
    )
}
