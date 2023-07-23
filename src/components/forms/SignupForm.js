import React, {useState} from 'react'
import styles from'../../css/SignupForm.module.css'
import {Link, useNavigate} from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import {useGoalContext} from '../../context/GoalContext'
import { removeTrailingWhiteSpace } from '../../utils/strings'
import { errorPrefix } from '@firebase/util'

function SignupForm() {

    const navigate = useNavigate()

    const {signup} = useAuthContext()
    const {pendingGoal, saveGoal, setHasPendingGoal, setPendingGoal} = useGoalContext()

    const [firstName, setFirstName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState(false)
    const [emailInUse, setEmailInUse] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [nameError, setNameError] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (removeTrailingWhiteSpace(firstName) === "") {
            setNameError(true)
            return
        }
        try {
            const newUser = await signup(firstName, email, password)
            if (Object.keys(pendingGoal).length > 0) {
                await saveGoal(newUser.user.uid, pendingGoal, pendingGoal.title)
                navigate("/goalconfirm")
                setHasPendingGoal(false)
                setPendingGoal({})
            } else {
                navigate("/")
            }
        } catch (error) {
            switch (error.code) {
                case "auth/weak-password":
                    setPasswordError(true)
                    break
                case "auth/email-already-in-use":
                    setEmailInUse(true)
                    break
                case "auth/invalid-email":
                    setEmailError(true)
                    break
            }
        }
    }

    const handleChange = () => {
        setEmailError(false)
        setEmailInUse(false)
        setNameError(false)
        setPasswordError(false)
    }

    return (
        <>
        <form className={styles.form} onSubmit={e => handleSubmit(e)} onChange={() => handleChange()}>
            {Object.keys(pendingGoal).length < 1 ? <label>Start here.</label> : <label>Sign up to save your goal.</label>}
            {nameError && <p className="warn">Please enter a name</p>}
            <input placeholder="First name..." type="text" onChange={e => setFirstName(e.target.value)}></input>
            {emailInUse && <p className="warn">Email already in use.</p>}
            {emailError && <p className="warn">Invalid email.</p>}
            <input placeholder="Email..." type="text" onChange={e => setEmail(e.target.value)}></input>
            {passwordError && <p className="warn">Password must be at least six characters</p>}
            <input placeholder="Password..." type="password" onChange={e => setPassword(e.target.value)}></input>
            {/* <input placeholder="Confirm password..." type="password"></input> */}
            <input type="submit" value="Sign Up"></input>
            <p className="subtext">Already have an account? <Link className="subtext" to="/signin">Sign in</Link></p>
        </form>
        </>
    )
}

export default SignupForm
