import React, {useState} from 'react'
import styles from '../../css/CreateNewGoal.module.css'
import {Link, useNavigate} from 'react-router-dom'
import { useGoalContext } from '../../context/GoalContext'
import { useAuthContext } from '../../context/AuthContext'
import { useEffect } from 'react/cjs/react.development'

function GoalConfirmation(props) {

    let navigate = useNavigate()

    const {currentTitle, currentUsersGoals, currentSummary, setCurrentSummary, updateGoalSummary} = useGoalContext()

    const [edited, setEdited] = useState(false)
    
    const handleChange = (e) => {
       setCurrentSummary(e.target.value)
       if (currentSummary !== currentUsersGoals[currentTitle]["summary"]) {
           setEdited(true)
       } else {
           setEdited(false)
       }
    }

    const handleSubmit = async () => {
        try {
            await updateGoalSummary(currentTitle, currentSummary)
            setEdited(false)
        } catch (error) {
            console.log(error)
        }
    }

    const handleClick = () => {
        navigate(`../viewgoal/${currentTitle}`)
    }

    return (
        <>
        <div className="flexColumn">
            <p className={styles.left}>Your goal has been saved. </p>
            <p className={styles.left}>The next step in setting achievable goals is an important one - send your plan to a friend: (feel free to edit before sending)</p>
            <textarea className={styles.summary} value={currentSummary} onChange={e => handleChange(e)}></textarea>
            {edited && <input className={styles.btn} type="button" value="save" onClick={() => handleSubmit()}></input>}
            <input className={styles.viewBtn} type="button" value="View your goal" onClick={handleClick}></input>
        </div>
        </>
    )
}

export default GoalConfirmation
