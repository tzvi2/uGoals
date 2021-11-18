import React, {useState} from 'react'
import styles from '../../css/SigninForm.module.css'
import {Link} from 'react-router-dom'

function SigninForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    return (
        <form className={styles.flexColumn}>
            {emailError && <p className={styles.error}>Email not found</p>}
            <input placeholder="Email..." type="text"></input>
            {passwordError && <p className={styles.error}>Incorrect password</p>}
            <input placeholder="Password..." type="password"></input>
            <input type="submit" value="Log In"></input>
            
            <p className={styles.subtext}>Don't have an account? <Link className={styles.subtext} to="/signup">Sign up</Link></p>
            {showForgotPassword && <p className={styles.subtext}>Forgot your password? <Link className={styles.subtext} to="/signup">Reset</Link></p>}
           
        </form>
    )
}

export default SigninForm
