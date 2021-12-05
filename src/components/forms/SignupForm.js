import React, {useState} from 'react'
import styles from'../../css/SignupForm.module.css'
import {Link, useNavigate} from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import {useGoalContext} from '../../context/GoalContext'

function SignupForm() {

    const navigate = useNavigate()

    const {signup} = useAuthContext()
    const {pendingGoal, saveGoal} = useGoalContext()

    const [firstName, setFirstName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const newUser = await signup(firstName, email, password)
            if (Object.keys(pendingGoal).length > 0) {
                await saveGoal(newUser.user.uid, pendingGoal, pendingGoal.title)
            }
            navigate("/")
        } catch (error) {
            console.log(error, 'error')
        }
    }
    return (
        
        <form className={styles.form} onSubmit={e => handleSubmit(e)}>
            <input placeholder="First name..." type="text" onChange={e => setFirstName(e.target.value)}></input>
            {emailError && <p className="error">Email already exists</p>}
            <input placeholder="Email..." type="text" onChange={e => setEmail(e.target.value)}></input>
            {passwordError && <p className="error">Passwords don't match</p>}
            <input placeholder="Password..." type="password" onChange={e => setPassword(e.target.value)}></input>
            {/* <input placeholder="Confirm password..." type="password"></input> */}
            <input type="submit" value="Sign Up"></input>
            <p className="subtext">Already have an account? <Link className="subtext" to="/signin">Sign in</Link></p>
        </form>
    )
}

export default SignupForm
