import React, {useState} from 'react'
import styles from '../../css/SigninForm.module.css'
import {Link, useNavigate} from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import { useGoalContext } from '../../context/GoalContext'

function SigninForm() {

    const navigate = useNavigate()

    const {authUser, signin} = useAuthContext()
    const {pendingGoal, saveGoal} = useGoalContext()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [showForgotPassword, setShowForgotPassword] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const newUser = await signin(email, password)
            if (Object.keys(pendingGoal).length > 0) {
                await saveGoal(newUser.user.uid, pendingGoal, pendingGoal.title)
            }
            navigate("/")
        } catch (error) {
            return -1
        }
    }
    return (
            <form className={styles.form} onSubmit={e => handleLogin(e)}>
                {emailError && <p className={styles.error}>Email not found</p>}
                <input placeholder="Email..." type="text" onChange={e => setEmail(e.target.value)}></input>
                {passwordError && <p className={styles.error}>Incorrect password</p>}
                <input placeholder="Password..." type="password" onChange={e => setPassword(e.target.value)}></input>
                <input type="submit" value="Log In"></input>
                
                <p className="subtext">Don't have an account? <Link className="subtext" to="/signup">Sign up</Link></p>
                {showForgotPassword && <p className={styles.subtext}>Forgot your password? <Link className={styles.subtext} to="/signup">Reset</Link></p>}
            </form>
    )
}

export default SigninForm
