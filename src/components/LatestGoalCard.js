import React, {useState} from 'react'
import styles from '../css/LatestGoalCard.module.css'
import { useGoalContext } from '../context/GoalContext'
import { useEffect } from 'react/cjs/react.development'
import {dateStringToUS, getDaysBetween, getTimeRemaining} from '../utils/dates'


function LatestGoalCard() {

    const {mostRecentKey, currentTitle, currentUsersGoals} = useGoalContext()

    return (
        <>
        {currentUsersGoals && mostRecentKey && currentUsersGoals[mostRecentKey] && Object.keys(currentUsersGoals).length > 0 &&
        <div className={styles.latestGoalCard}>

            <label className={styles.ribbon}>Latest...</label>

            <div className={styles.row}>
                <label>Title:</label>
                <p>{currentUsersGoals[mostRecentKey].title }</p>
            </div>

            <div className={styles.row}>
                <label>Due:</label>
                <p>{dateStringToUS(currentUsersGoals[mostRecentKey].deadline)}</p>
            </div>
            
            <div className={styles.row}>
                <label>Each day:</label>
            </div>
                
            <ul>
            {Object.keys(currentUsersGoals[mostRecentKey].actions).map((key, i) => (
                <li key={i}>{currentUsersGoals[mostRecentKey].actions[key].name}</li>
            ))}
            </ul>
                
            <div className={styles.row}>
                <label>Days remaining:</label>
                {currentUsersGoals[mostRecentKey] && <p className={styles.days}>{getDaysBetween(new Date(), new Date(currentUsersGoals[mostRecentKey].deadline))}</p>}
            </div>
            
        </div>}
        </>
    )
}

export default LatestGoalCard
