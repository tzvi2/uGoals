import React, { useEffect } from 'react'
import { useState } from 'react/cjs/react.development'
import { useAuthContext } from '../../context/AuthContext'
import { useGoalContext } from '../../context/GoalContext'
import {AuthCredential, deleteUser, EmailAuthCredential, EmailAuthProvider, reauthenticateWithCredential} from '@firebase/auth'
import {useNavigate} from 'react-router-dom'
import SigninForm from '../forms/SigninForm'
import styles from '../../css/AccountDeletionConfirmation.module.css'
import {auth, db} from '../../config/firebase'

function AccountDeletionConfirmation() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [accountDeleted, setAccountDeleted] = useState(false)
    const [passwordError, setPasswordError] = useState(false)

    const {deleteAccount, authUser, reAuthenticate} = useAuthContext()
    const {setPendingGoal} = useGoalContext()
    const [showSignIn, setShowSignIn] = useState(false)

    let navigate = useNavigate()

    const removeAccount = async () => {
        try {
            await deleteAccount(authUser.uid)
            setAccountDeleted(true)
            setShowSignIn(false)
        } catch (error) {
            setShowSignIn(true)
            console.log('deleting error',error)
        }
    }

    const handleReauthentication = async () => {
        try {
            await reAuthenticate(password)
            await removeAccount()
        } catch (error) {
            setPasswordError(true)
            console.log(error)
        }
    }

    useEffect(() => {
        removeAccount()
    }, [])

    return (
        <>
        {showSignIn && <> 
        <form className={styles.reAuthenticate}>
            <p>Please confirm account info:</p>
            {passwordError && <p className="warn">Incorrect password.</p>}
            <input type="password" placeholder="password" value={password} onChange={(e) => {setPasswordError(false); setPassword(e.target.value)}}></input>
            <input type="button" value="Delete account" onClick={() => handleReauthentication()}></input>
        </form>
        {/* <input className="warn" type="button" value="Delete" onClick={() => removeAccount()}></input> */}
        </>}
        {accountDeleted && <div className={styles.confirm}>
            <p>Your account has been deleted.</p> 
            <p>Come back anytime.</p>
        </div>}
        </>
    )
}

export default AccountDeletionConfirmation
