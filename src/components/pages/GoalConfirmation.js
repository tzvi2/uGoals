import React, {useState} from 'react'
import styles from '../../css/CreateNewGoal.module.css'
import {Link, useNavigate} from 'react-router-dom'
import { useGoalContext } from '../../context/GoalContext'

function GoalConfirmation(props) {
    const {currentGoal} = useGoalContext()
    return (
        <div className={styles.flexColumn}>
            <label>Finally, send your plan to a friend. Feel free to edit first:</label>
            <textarea className={styles.summary} value={props.summary} onChange={e => currentGoal.summary = e.target.value}></textarea>
        </div>
    )
}

export default GoalConfirmation
