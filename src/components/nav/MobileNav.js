import React, {useState, useRef, useEffect} from 'react'
import {Link} from 'react-router-dom'
import styles from '../../css/MobileNav.module.css'
import { Cross as Hamburger } from 'hamburger-react'
import { useAuthContext } from '../../context/AuthContext'



function MobileNav() {
    const [expanded, setExpanded] = useState(false)
    const wrapper = useRef(null)
    const {currentUser} = useAuthContext()

    const handleClickOutside = (e) => {
        if (wrapper.current && !wrapper.current.contains(e.target)) {
            setExpanded(false)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [wrapper])

    return (
        <nav ref={wrapper}>
            <div className={styles.topBar}>
                <Link onClick={() => setExpanded(false)} to="/"><h1>uGoals</h1></Link>
                <div className={styles.hamburger}><Hamburger size={40} toggled={expanded} toggle={setExpanded} /></div>
            </div>
            
            <div className={`${styles.menu} ${expanded ? `${styles.slideout}` : `${styles.slidein}`}`} onClick={() => setExpanded(false)}>

                    <Link to="/account">Account</Link>   
                    <Link to="/newgoal">New goal</Link>   
                    <Link to="/viewgoals">View goals</Link>
                    <Link to="/about">About</Link> 
                    {currentUser ? <Link to="/signout">Sign out</Link> : <Link to="/signin">Sign In</Link>}            
                    {!currentUser && <Link to="/signup">Sign up</Link>}            
                
            </div>
           
        </nav>
    )
}

export default MobileNav
