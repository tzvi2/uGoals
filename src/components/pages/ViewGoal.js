import React, {useState, useEffect} from 'react'
import styles from '../../css/ViewGoal.module.css'
import { useGoalContext } from '../../context/GoalContext'
import { useAuthContext } from '../../context/AuthContext'
import {useParams} from 'react-router-dom'
import {joinSpacedString, cleanUrl} from '../../utils/strings'

function ViewGoal(props) {

    const {setCurrentTitle, currentTitle, currentDeadline, setCurrentDeadline, currentUsersGoals, currentGoal, toggleGoalComplete} = useGoalContext()
    const {authUser} = useAuthContext()

    let params = useParams()
    
    useEffect(() => {
        setCurrentTitle(params.goalId)
    }, []) 

    const [newTitle, setNewTitle] = useState(props.title)
    const [newDeadline, setNewDeadline] = useState(props.deadline)
    const [showSummary, setShowSummary] = useState(false)
    const [editing, setEditing] = useState(false)
    const [changed, setChanged] = useState(false)
    const [saved, setSaved] = useState(false)

    const handleEditClick = () => {
        setEditing(!editing)
    }

    const handleTitleChange = (e) => {
        setCurrentTitle(e.target.value)
    }

    const handleDeadlineChange = (e) => {
        
    }

    const toggleComplete = async (e) => {
        
        try {
            await toggleGoalComplete(authUser.uid, currentTitle, currentUsersGoals[currentTitle].complete)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
        {currentUsersGoals && Object.keys(currentUsersGoals).length > 0 && 
        <div className={styles.flexColumn}>

            <button className={`${styles.editButton} ${editing && `${styles.editing}`} `} onClick={handleEditClick}>Edit</button>

            <div className={styles.row}>
                <label>Title</label>
                <textarea rows={1} readOnly={!editing} value={currentTitle} onChange={e => handleTitleChange(e)}></textarea>
            </div>

            <div className={styles.row}>
                <label>Deadline</label>
                <input disabled={!editing} type="date" value={currentUsersGoals[currentTitle]["deadline"]} onChange={e => handleDeadlineChange(e)}></input>
            </div>

            <label>{`${currentUsersGoals[currentTitle]["perPeriodSummary"]}:`}
                <ul>
                    {Object.keys(currentUsersGoals[currentTitle].actions).map((key, i) => (
                        <li key={i}>{currentUsersGoals[currentTitle].actions[key]}</li>
                    ))}
                </ul>
            </label>
            
            <div className={styles.row}>
                <label>{currentUsersGoals[currentTitle].complete ? "complete" : "In progress"}</label>
                <input className={styles.customCheckbox} type="checkbox" checked={currentUsersGoals[currentTitle]["complete"]} onChange={() => toggleComplete()}></input>
            </div>

            
            <input className={`${showSummary ? `${styles.wide}` : `${styles.expanded}`} `} type="button" value="Summary" onClick={() => setShowSummary(!showSummary)}></input>
            
            
            {showSummary && <textarea className={styles.summary} readOnly={!editing} value={currentUsersGoals[currentTitle].summary}></textarea>}
                
            {editing && changed && <input className={styles.saveButton} type="button" value="Save" onClick={() => {setEditing(false); setChanged(false); setSaved(true)}}></input>}
            
            
        </div>}
        </>
    )
}

export default ViewGoal
