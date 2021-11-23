import React from 'react'
import styles from '../../css/Account.module.css'
import { useAuthContext } from '../../context/AuthContext'
import { useEffect, useState } from 'react/cjs/react.development'


function Account() {
  
    const {authUser, user} = useAuthContext()
    const [date, setDate] = useState(null)
    const [deleteStage, setDeleteStage] = useState(1)
   
    useEffect(() => {
        if (authUser) {
            setDate(new Date(Number(authUser.metadata.createdAt)))
        } 
        return 
    }, [authUser])

    const handleDeleteAccount = async () => {

    }

    return (
        
        <div className={styles.flexColumn}>
            {authUser && date && <>
            <h3>Account info:</h3>
            <div className={styles.row}>
                <label>Username: </label>
                <input readOnly value={authUser?.displayName}></input>
            </div>
            <div className={styles.row}>
                <label>Email:</label>
                <input readOnly value={authUser?.email}></input>
            </div>
            <div className={styles.row}>
                <label>Created on:</label>
                <input readOnly value={date.toLocaleString()}></input>
            </div>
            <div className={styles.row}>
                <label>Goals created:</label>
                <input readOnly value="5"></input>
            </div>
            <div className={styles.row}>
                <label>Goals completed:</label>
                <input readOnly value="3"></input>
            </div>
            <div className={styles.row}>
                <label>Goal completion:</label>
                <input readOnly value="60%"></input>
            </div>
            {deleteStage === 1 && <input className={styles.warn} type="button" value="Delete account" onClick={()=>setDeleteStage(2)}></input>}
            {deleteStage === 2 && 
            <>
            <label>Are you sure?</label>
            <div className={styles.row}>
            <input type="button" onClick={() => setDeleteStage(1)} value="Cancel"></input>
            <input className={styles.warn} type="button" onClick={e => handleDeleteAccount(e)} value="Delete"></input>
            </div>
            </> }
            </> }
        </div>
    )
}

export default Account
