import React, {useState, useRef, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import styles from '../../css/MobileNav.module.css'
import { Cross as Hamburger } from 'hamburger-react'
import { useAuthContext } from '../../context/AuthContext'
import { useGoalContext } from '../../context/GoalContext'

function MobileNav(props) {
    const [expanded, setExpanded] = useState(false)
    const wrapper = useRef(null)
    const {authUser, signout} = useAuthContext()
    const {setPendingGoal} = useGoalContext()
    const navigate = useNavigate()

    const handleClickOutside = (e) => {
        if (wrapper.current && !wrapper.current.contains(e.target)) {
            setExpanded(false)
        }
    }

    const handleSignOut = async () => {
        try {
            await signout()
            setPendingGoal({})
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        props.setBluredState(expanded ? "blured" : "clear")
        // props.setBluredState("clear")
    }, [expanded])

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [wrapper])

    return (
        <nav className={styles.mobileNav} ref={wrapper}>
            <div className={styles.topBar}>
            {/* style={expanded ? {"color": "var(--shade1)"} : {"color": "var(--shade3)" }} */}
                <h1 onClick={() => {setExpanded(false); navigate("/")}}>uGoals</h1>
                <div className={styles.hamburger}><Hamburger size={40} toggled={expanded} toggle={setExpanded}/></div>
            </div>
            
            {expanded && <div className={`${styles.menu} ${expanded ? `${styles.slideout}` : `${styles.slidein}`}`} onClick={() => setExpanded(false)}>
                {authUser &&<Link to="/account">Account</Link>}
                <Link to="/newgoal">New goal</Link>
                {authUser &&<Link to="/viewgoals">View goals</Link>}
                <Link to="/about">About</Link> 
                {authUser ? <Link to="/signout" onClick={handleSignOut}>Sign out</Link> : <Link to="/signin">Sign In</Link>}            
                {!authUser && <Link to="/signup">Sign up</Link>}            
            </div>}
           
        </nav>
    )
}

export default MobileNav
