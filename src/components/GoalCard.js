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

    const {currentUsersGoals, setJustOpenedGoal, toggleGoalComplete} = useGoalContext()
    const {authUser} = useAuthContext()

    const handleViewGoal = () => {
        setJustOpenedGoal(true)
        navigate(`../viewgoal/${props.goal.title}`)
    }

    const cardStyle = {
        "animationDelay": `${(props.index + 1) / 4}s`,
    }

    const toggleComplete = async (e) => {
        try {
            await toggleGoalComplete(authUser.uid, props.id, currentUsersGoals[props.id].complete)
        } catch (err) {
            console.log(err)
        }
    }
    
    return (
        <>
        {currentUsersGoals && currentUsersGoals[props.id] &&
        <div className={props.goal.complete ? `${styles.goalCard} ${styles.completeGoal}` : `${styles.goalCard}`} style={cardStyle}>
            <div className={styles.row}>
                <label>Title</label>
                <p className={styles.title}>{props.goal.title}</p>
            </div>
            <div className={styles.row}>
                <label>Deadline</label>
                <p className={props.goal.complete ? `${styles.disabled}` : ""}>{props.goal.deadline}</p>
            </div>
            <div className={`${styles.complete}`}>
                <label>{props.goal.complete ? "Complete" : "In progress"}</label>
                <input className={styles.customCheckbox} type="checkbox" checked={currentUsersGoals[props.id].complete} onChange={() => toggleComplete()}></input>
            </div>
            <div className={`${styles.row} ${styles.center}`}>
                <input type="button" value="View" onClick={handleViewGoal}></input>
            </div>
        </div>
        }
        </>

    )

}

export default GoalCard
