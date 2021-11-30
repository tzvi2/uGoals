import React, { useEffect } from 'react'
import { useState } from 'react/cjs/react.development'
import { useAuthContext } from '../../context/AuthContext'
import {deleteUser, reauthenticateWithCredential} from '@firebase/auth'
import {useNavigate} from 'react-router-dom'
import SigninForm from '../forms/SigninForm'

function AccountDeletionConfirmation() {
    const [accountDeleted, setAccountDeleted] = useState(false)
    const {deleteAccount, authUser} = useAuthContext()
    const [showSignIn, setShowSignIn] = useState(false)

    let navigate = useNavigate()

    const removeAccount = async () => {
        try {
            await deleteUser(authUser)
            setAccountDeleted(true)
        } catch (error) {
            setShowSignIn(true)
            console.log('deleting error',error)
        }
    }
    useEffect(() => {
        removeAccount()
    }, [])
    return (
        <>
        {showSignIn && <> 
        <SigninForm />
        <input className="warn" type="button" value="Delete" onClick={() => removeAccount()}></input>
        </>}
        {accountDeleted && <div>
            <p>Your account has been deleted.</p> 
            <p>Join again when you're ready.</p>
        </div>}
        </>
    )
}

export default AccountDeletionConfirmation
