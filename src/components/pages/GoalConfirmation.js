import React, {useState} from 'react'
import styles from '../../css/CreateNewGoal.module.css'
import {Link, useNavigate} from 'react-router-dom'
import { useGoalContext } from '../../context/GoalContext'

function GoalConfirmation(props) {
    const {currentGoal, setCurrentGoal} = useGoalContext()

    const handleChange = (e) => {
        let tempGoal = currentGoal
        tempGoal.summary = e.target.value
        setCurrentGoal(tempGoal)
    }

    return (
        <div className={styles.flexColumn}>
            <label>Your goal has been saved. Now send your plan to a friend. Feel free to edit before sending:</label>
            <textarea className={styles.summary} value={currentGoal?.summary} onChange={e => handleChange(e)}></textarea>
        </div>
    )
}

export default GoalConfirmation
