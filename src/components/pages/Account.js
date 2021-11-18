import React from 'react'
import styles from '../../css/Account.module.css'


function Account() {
    return (
        <div className={styles.flexColumn}>
            <h3>Account info:</h3>
            <div className={styles.row}>
                <label>Username:</label>
                <input readOnly value="Peep"></input>
            </div>
            <div className={styles.row}>
                <label>Email:</label>
                <input readOnly value="tzvib2@gmail.com"></input>
            </div>
            <div className={styles.row}>
                <label>Created on:</label>
                <input readOnly value="November 16, 2021"></input>
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
            <input className={styles.warn} type="button" value="Delete account"></input>
            
        </div>
    )
}

export default Account
