import React, {useState} from 'react'
import styles from '../css/LatestGoalCard.module.css'
import { useGoalContext } from '../context/GoalContext'
import { useEffect } from 'react/cjs/react.development'
import {dateStringToUS, getDaysBetween, getTimeRemaining} from '../utils/dates'


function LatestGoalCard() {

    const {mostRecentKey, currentTitle, currentUsersGoals} = useGoalContext()


    // useEffect(() => {
    //     console.log('most recent key', mostRecentKey)
    //     console.log('currnetUsersGoal[mostrecentkeys]', currentUsersGoals[mostRecentKey])
    //     console.log('currnetUsersGoal[mostrecentkeys].deadline', currentUsersGoals[mostRecentKey].deadline)
    //     console.log('new date', new Date())
    //     console.log('new date from deadline', new Date(currentUsersGoals[mostRecentKey].deadline))
    //     console.log('getDaysBetween', getDaysBetween(new Date(), new Date(currentUsersGoals[mostRecentKey].deadline)))
    // }, [mostRecentKey])

    return (
        <>
        {currentUsersGoals && currentUsersGoals.actions && Object.keys(currentUsersGoals).length > 0 &&
        <div className={styles.latestGoalCard}>

            <label className={styles.ribbon}>Latest...</label>

            <div className={styles.row}>
                <label>Title:</label>
                <p>{mostRecentKey}</p>
            </div>

            <div className={styles.row}>
                <label>Due:</label>
                <p>{dateStringToUS(currentUsersGoals[mostRecentKey]["deadline"])}</p>
            </div>
            
            <div className={styles.row}>
                <label>Each day:</label>
            </div>
                
            <ul>
            {Object.keys(currentUsersGoals.actions).map((key, i) => (
                <li key={i}>{currentUsersGoals.actions[key].name}</li>
            ))}
            </ul>
                
            <div className={styles.row}>
                <label>Days remaining:</label>
                {currentUsersGoals[mostRecentKey] && <p className={styles.days}>{getDaysBetween(new Date(), new Date(currentUsersGoals[mostRecentKey]["deadline"]))}</p>}
            </div>
            
        </div>}
        </>
    )
}

export default LatestGoalCard
