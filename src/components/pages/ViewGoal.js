import React, {useState} from 'react'
import styles from '../../css/ViewGoal.module.css'
import { useGoalContext } from '../../context/GoalContext'

function ViewGoal(props) {

    const {currentGoal} = useGoalContext()
    
    const [newTitle, setNewTitle] = useState(props.title)
    const [newDeadline, setNewDeadline] = useState(props.deadline)

    const newGoal = {
        title: "",
        deadline: new Date().toLocaleDateString("en-ca")
    }


    const [editing, setEditing] = useState(false)
    const [changed, setChanged] = useState(false)
    const [saved, setSaved] = useState(false)

    const handleEditClick = () => {
        setEditing(!editing)
        if (saved) return
        setNewTitle(currentGoal?.title)
        setNewDeadline(currentGoal?.deadline)


    }

    const handleTitleChange = (e) => {
        setSaved(false)
        setNewTitle(e.target.value)
        if (e.target.value !== newGoal.title) {
            setChanged(true)
        } else {
            setChanged(false)
        }
    }

    const handleDeadlineChange = (e) => {
        setSaved(false)
        setNewDeadline(e.target.value)
        if (e.target.value !== newGoal.deadline) {
            setChanged(true)
        } else {
            setChanged(false)
        }
    }

    return (
        <div className={styles.flexColumn}>

            <button className={`${styles.editButton} ${editing ? `${styles.editing}` : ""} `} onClick={handleEditClick}>Edit</button>

            <div className={styles.flexRow}>
                <label>Title</label>
                <textarea rows={1} readOnly={!editing} value={newTitle} onChange={e => handleTitleChange(e)}></textarea>
            </div>

            <div className={styles.flexRow}>
                <label>Deadline</label>
                <input disabled={!editing} type="date" value={newDeadline} onChange={e => handleDeadlineChange(e)}></input>
            </div>

            
            <label>{currentGoal.perPeriodSummary}
                <ul>
                    <li>Eating cheetos</li>
                    <li>Eating another bag of cheetos</li>
                    <li>Barfing up two bags of cheetos as well as whatever other garbage</li>
                </ul>
            </label>
                
            {editing && changed && <input className={styles.saveButton} type="button" value="Save" onClick={() => {setEditing(false); setChanged(false); setSaved(true)}}></input>}
            
            <div className={styles.saveRow}>
                <label>Complete: <input type="checkbox"></input></label>
            </div>
        </div>
    )
}

export default ViewGoal
