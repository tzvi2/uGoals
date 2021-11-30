import React from 'react'
import {Link} from 'react-router-dom'
import styles from '../../css/DesktopNav.module.css'
import { useAuthContext } from '../../context/AuthContext'

function DesktopNav() {
    const {authUser, signout} = useAuthContext()
    const handleSignOut = async () => {
        try {
            await signout()
        } catch (err) {
            return -1
        }
    }
    return (
        
        <nav className={styles.desktopNav}>
            <div className={styles.logo}>
                <Link to="/"><h1>uGoals</h1></Link>
            </div>
            <div className={styles.links}>
                <Link to="/newgoal">New Goal</Link>
                {authUser && <Link to="viewgoals">View Goals</Link>}          
                {authUser && <Link to="/" onClick={() => handleSignOut()}>Sign out</Link>}            
                {!authUser && <Link to="/signup">Sign up</Link>} 
                <Link to="/about">About</Link> 
                {authUser && <Link to="/account">Account</Link> }
            </div>
        </nav>
        
    )
}

export default DesktopNav
