import React, {useState} from 'react'
import styles from'../../css/SignupForm.module.css'
import {Link} from 'react-router-dom'

function SignupForm() {
    const [firstName, setFirstName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    return (
        <form className={styles.flexColumn}>
            <input placeholder="First name..." type="text"></input>
            {emailError && <p className={styles.error}>Email already exists</p>}
            <input placeholder="Email..." type="text"></input>{passwordError && <p className={styles.error}>Passwords don't match</p>}
            <input placeholder="Password..." type="text"></input>
            <input placeholder="Confirm password..." type="password"></input>
            <input type="submit" value="Sign Up"></input>
            <p className={styles.subtext}>Already have an account? <Link className={styles.subtext} to="/signin">Sign in</Link></p>
        </form>
    )
}

export default SignupForm
