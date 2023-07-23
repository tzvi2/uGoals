import React, {useState} from 'react'
import styles from '../../css/CreateNewGoal.module.css'
import {Link, useNavigate} from 'react-router-dom'
import { useGoalContext } from '../../context/GoalContext'
import { useAuthContext } from '../../context/AuthContext'
import { useEffect } from 'react/cjs/react.development'

function GoalConfirmation(props) {

    let navigate = useNavigate()

    const {currentTitle, currentUsersGoals, currentSummary, setCurrentSummary, updateGoalSummary} = useGoalContext()

    const handleClick = () => {
        navigate(`../viewgoal/${currentTitle}`)
    }

    return (
        <>
        <div className={styles.confirmation}>
            
            <p>Your goal has been saved.</p>
            <input className={styles.viewBtn} type="button" value="View Goal" onClick={() => handleClick()}></input>
        </div>
        </>
    )
}

export default GoalConfirmation
