import React, {useState, useEffect} from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
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
import styles from '../../css/Nav.module.css'
import AccountDeletionConfirmation from '../pages/AccountDeletionConfirmation'


function Nav() {

    const mql = window.matchMedia("screen and (max-width: 770px)")
    const [mobile, setMobile] = useState(mql.matches)
    const handleScreenResize = () => setMobile(mql.matches)

    useEffect(() => {
        mql.addEventListener('change', handleScreenResize)
        return () => mql.removeEventListener('change', handleScreenResize)
    }, [mql])

    return (
        <>
            {mobile ? <MobileNav /> : <DesktopNav />}
            <div className="App">
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/account" element={<Account />} />
                <Route path="/newgoal" element={<NewGoal />} />
                <Route path="/goalconfirm" element={<GoalConfirmation />} />
                <Route path="/viewgoal" element={<ViewGoal />}>
                    <Route path=":goalId" element={<ViewGoal />} />
                </Route>
                <Route path="/viewgoals" element={<ViewGoals />} />
                <Route path="/about" element={<About />} />
                <Route path="/signin" element={<SigninForm />} />
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/deleteaccount" element={<AccountDeletionConfirmation />} />
            </Routes>
            </div>
        </>
    )
}

export default Nav
