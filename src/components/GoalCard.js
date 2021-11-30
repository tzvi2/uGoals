import React, {useState} from 'react'
import styles from '../css/GoalCard.module.css'
import {Link, useNavigate} from 'react-router-dom'
import { useGoalContext } from '../context/GoalContext'
import { useAuthContext } from '../context/AuthContext'
import { dateStringToUS } from '../utils/dates'
import { useEffect } from 'react/cjs/react.development'
import { joinSpacedString } from '../utils/strings'

function GoalCard(props) {

    let navigate = useNavigate()

    const {currentUsersGoals, setGoalComplete, setCurrentGoal, toggleGoalComplete} = useGoalContext()
    const {authUser} = useAuthContext()

    const handleViewGoal = () => {
        navigate(`../viewgoal/${props.id}`)
    }

    const cardStyle = {
        "animationDelay": `${(props.index + 1) / 4}s`,
    }

    const toggleComplete = async (e) => {
        try {
            await toggleGoalComplete(authUser.uid, props.title, currentUsersGoals[props.title].complete)
        } catch (err) {
            console.log(err)
        }
    }
    

    return (
        <>{currentUsersGoals &&
        <div className={styles.goalCard} style={cardStyle}>
            <div className={styles.row}>
                <label>Title</label>
                <p>{props.title}</p>
            </div>
            <div className={styles.row}>
                <label>Deadline</label>
                <p>{props.deadline}</p>
            </div>
            <div className={`${styles.complete}`}>
                <label>{currentUsersGoals[props.title].complete ? "complete" : "In progress"}</label>
                <input className={styles.customCheckbox} type="checkbox" checked={currentUsersGoals[props.title].complete} onChange={() => toggleComplete()}></input>
            </div>
            <div className={`${styles.row} ${styles.center}`}>
                <input type="button" value="View" onClick={handleViewGoal}></input>
            </div>
        </div>
        }</>
    )

}

export default GoalCard
