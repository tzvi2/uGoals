import React, {useState} from 'react'
import styles from '../css/GoalCard.module.css'
import {Link} from 'react-router-dom'

function GoalCard() {
    
    return (
        <div className={styles.goalCard}>
            <div className={styles.row}>
                <label>Title</label>
                <textarea readOnly type="text" value="Increase monthly revenue by $10,000"></textarea>
            </div>
            <div className={styles.row}>
                <label>Due</label>
                <textarea readOnly type="text" value="August 5, 2024"></textarea>
            </div>
            <label>in progress</label>
            <Link to={`/viewgoal`}>View</Link>
        </div>
    )
}

export default GoalCard
