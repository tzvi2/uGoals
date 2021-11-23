import React, {useState} from 'react'
import styles from '../css/GoalCard.module.css'
import {Link, useNavigate} from 'react-router-dom'
import { useGoalContext } from '../context/GoalContext'

function GoalCard(props) {

    let navigate = useNavigate()

    const {currentUsersGoals, currentGoal, setCurrentGoal, currentGoalID, setCurrentGoalID} = useGoalContext()

    const handleViewGoal = () => {
        setCurrentGoal(currentUsersGoals[props.id])
        navigate("/viewgoal")
    }

    const cardStyle = {
        "animation-delay": `${(props.index + 1) / 4}s`
    }

    return (
        <div className={styles.goalCard} style={cardStyle}>
            <div className={styles.row}>
                <label>Title</label>
                <p>{props.title}</p>
            </div>
            <div className={styles.row}>
                <label>Deadline</label>
                <p>{props.deadline}</p>
            </div>
            <div className={styles.row}>
                <label className={styles.progress}>{props.complete ? "complete" : "in progress"}</label>
            </div>
            <input type="button" value="View" onClick={handleViewGoal}></input>
        </div>
    )
}

export default GoalCard
