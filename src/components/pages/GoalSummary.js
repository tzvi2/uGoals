import React, {useState} from 'react'
import styles from '../../css/CreateNewGoal.module.css'
import {Link, useNavigate} from 'react-router-dom'
import { useGoalContext } from '../../context/GoalContext'
import { useAuthContext } from '../../context/AuthContext'
import { useEffect } from 'react/cjs/react.development'

function GoalSummary(props) {

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
        <div className={styles.confirmation}>
            
            <p >The next step is an important one. Copy, paste, and send this summary to a friend through your preferred means...</p>
            <textarea className={styles.summary} value={currentSummary} onChange={e => handleChange(e)}></textarea>
            {edited && <input className={styles.btn} type="button" value="save" onClick={() => handleSubmit()}></input>}
            <input className={styles.viewBtn} type="button" value="View your goal" onClick={handleClick}></input>
        </div>
        </>
    )
}

export default GoalSummary
