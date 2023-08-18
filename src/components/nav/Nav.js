import React, {useState, useEffect} from 'react'
import {Routes, Route} from 'react-router-dom'
import MobileNav from './MobileNav'
import DesktopNav from './DesktopNav'
import About from '../pages/About'
import NewGoal from '../pages/CreateNewGoal'
import ViewGoal from '../pages/ViewGoal'
import ViewGoals from '../pages/ViewGoals'
import Account from '../pages/Account'
import App from '../../App'
import SigninForm from '../forms/SigninForm'
import SignupForm from '../forms/SignupForm'
import GoalConfirmation from '../pages/GoalConfirmation'
import AccountDeletionConfirmation from '../pages/AccountDeletionConfirmation'
import Footer from '../Footer'
import Popup from '../Popup'
import { useGoalContext } from '../../context/GoalContext'


function Nav() {

    const {secondsRemaining, setSecondsRemaining} = useGoalContext()

    const mql = window.matchMedia("screen and (max-width: 770px)")
    const [mobile, setMobile] = useState(mql.matches)
    const handleScreenResize = () => setMobile(mql.matches)

    const [bluredState, setBluredState] = useState("clear")

    useEffect(() => {
        mql.addEventListener('change', handleScreenResize)
        return () => mql.removeEventListener('change', handleScreenResize)
    }, [mql])

    

    return (
        
        <>
            {mobile ? <MobileNav bluredState={bluredState} setBluredState={setBluredState} /> : <DesktopNav />}
            {secondsRemaining > 0 && <div className="popup">
                <Popup text="Your changes have been saved."/>
            </div>}
            <div className={`middle ${bluredState}`}>
            {/* <div className='crossbar'></div> */}
            <Routes>
                <Route path="/ugoals" element={<App />} />
                <Route path="/account" element={<Account />} />
                <Route path="/newgoal" element={<NewGoal />} />
                <Route path="/goalconfirm" element={<GoalConfirmation />} />
                <Route path="/viewgoal" element={<ViewGoal />}>
                    <Route path=":goalTitle" element={<ViewGoal />} />
                </Route>
                <Route path="/viewgoals" element={<ViewGoals />} />
                <Route path="/about" element={<About />} />
                <Route path="/signin" element={<SigninForm />} />
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/delete_account" element={<AccountDeletionConfirmation />} />
            </Routes>
            </div>
        
        <Footer />
        </>
    )
}

export default Nav
