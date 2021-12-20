import React, {useEffect, useState} from 'react'
import styles from '../../css/Account.module.css'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import {getFraction} from '../../utils/math'


function Account() {

    let navigate = useNavigate()
  
    const {authUser, userInfo, authLoading} = useAuthContext()
  
    const [date, setDate] = useState(null)
    const [deleteStage, setDeleteStage] = useState(1)
    const [editing, setEditing] = useState()
    const [newUsername, setNewUsername] = useState()

    const handleDeleteAccount = async () => {
        navigate("../delete_account")
    }

    return (
        <div className={styles.account}>
        {userInfo && <>
        <h3>Account info:</h3>

        <div className={styles.row}>
            <label>Username: </label>
            <p>{authUser?.displayName}</p>
        </div>

        <div className={styles.row}>
            <label>Email:</label>
            <p>{authUser?.email}</p>
        </div>

        <div className={styles.row}>
            <label>Created on:</label>
            <p>{new Date(Number(authUser.metadata.createdAt)).toLocaleDateString()}</p>
        </div>

        <div className={styles.row}>
            <label>Goals created:</label>
            {userInfo && <p>{userInfo.goalsCreated}</p>}
        </div>

        <div className={styles.row}>
            <label>Goals completed:</label>
            {userInfo && <p>{userInfo.goalsCompleted}</p>}
        </div>

        {userInfo && userInfo.goalsCreated > 0 && 
        <div className={styles.row}>
            <label>Completion rate:</label>
            <p>{getFraction(userInfo.goalsCompleted, userInfo.goalsCreated)}</p>
        </div>}
    
        <div className={styles.col}>
            {deleteStage === 1 ?
            <input className="warn" type="button" value="Delete account" onClick={()=>setDeleteStage(2)}></input>
            :
            <>
            <label>Are you sure?</label>
            <div className={styles.row}>
                <input type="button" className="gold" onClick={() => setDeleteStage(1)} value="Cancel"></input>
                <input className="warn" type="button" onClick={e => handleDeleteAccount(e)} value="Delete"></input>
            </div>
            </>
            }
        </div>
        </>}
    </div>
    )
}

export default Account
