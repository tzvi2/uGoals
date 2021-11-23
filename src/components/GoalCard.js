import React, {useState} from 'react'
import styles from '../css/GoalCard.module.css'
import {Link, useNavigate} from 'react-router-dom'
import { useGoalContext } from '../context/GoalContext'

function GoalCard(props) {

    let navigate = useNavigate()

    const {currentUsersGoals, currentGoal, setCurrentGoal, currentGoalID, setCurrentGoalID} = useGoalContext()

    const handleViewGoal = () => {
        setCurrentGoal(currentUsersGoals[props.id])
        //setCurrentGoalID(props.id)
        navigate("/viewgoal")
    }

    return (
        <div className={styles.goalCard}>
            <div className={styles.row}>
                <label>Title</label>
                <textarea readOnly type="text" value={props.title}></textarea>
            </div>
            <div className={styles.row}>
                <label>Due</label>
                <textarea readOnly type="text" value={props.deadline}></textarea>
            </div>
            <label>{props.complete ? "complete" : "in progress"}</label>
            <input type="button" value="View" onClick={handleViewGoal}></input>
        </div>
    )
}

export default GoalCard
