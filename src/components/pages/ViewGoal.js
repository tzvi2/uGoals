import React, {useState, useEffect} from 'react'
import styles from '../../css/ViewGoal.module.css'
import { useGoalContext } from '../../context/GoalContext'
import { useAuthContext } from '../../context/AuthContext'
import {useParams, useNavigate} from 'react-router-dom'
import {joinSpacedString, cleanUrl} from '../../utils/strings'
import ActionsForm from '../forms/ActionsForm'
import check from '../../images/check.png'
import {objectIsEmpty} from '../../utils/objects'
import Popup from '../Popup'
import { getRandomID } from '../../utils/ids'


function ViewGoal(props) {

    const {setCurrentTitle, currentTitle, currentDeadline, setCurrentDeadline, currentUsersGoals, currentGoal, setCurrentGoal, toggleGoalComplete, pendingGoal, setPendingGoal, secondsRemaining, setSecondsRemaining, deleteGoal} = useGoalContext()
    const {authUser} = useAuthContext()

    let params = useParams()
    let navigate = useNavigate()
    
    useEffect(() => {
        if (currentUsersGoals && currentUsersGoals[params.goalId])  {
           setCurrentGoal(currentUsersGoals[params.goalId]) 
        }
        
    }, [currentUsersGoals]) 

    useEffect(() => {
       
        console.log('currentGoal', currentGoal?.complete)
    }, [currentGoal])
    



    const [newTitle, setNewTitle] = useState(props.title)
    const [newDeadline, setNewDeadline] = useState(props.deadline)
    const [showSummary, setShowSummary] = useState(false)
    const [editing, setEditing] = useState(true)
    const [showSavedChangesMessage, setShowSavedChangesMessage] = useState(false)
    const [changed, setChanged] = useState(false)
    const [saved, setSaved] = useState(false)
    // const [secondsRemaining, setSecondsRemaining] = useState(0)
    const [actionError, setActionError] = useState(false)
    const [newAction, setNewAction] = useState("")

    const handleEditClick = () => {
        setEditing(!editing)
    }

    const handleTitleChange = (e) => {
        setPendingGoal({...pendingGoal, title: e.target.value})
        // setSecondsRemaining(2)
    }

    const handleDeadlineChange = (e) => {
        setPendingGoal({...pendingGoal, deadline: e.target.value})
        
    }

    const handleActionChange = (e, k) =>  {
        if (e.target.value === "") {
            removeAction(k)
        } else {
            const newActions = {...pendingGoal.actions, [k]: {...pendingGoal.actions[k], name: e.target.value}}
            setPendingGoal({...pendingGoal, actions: newActions})
            setSecondsRemaining(2)
        }

        
    }

    const handleNewActionChange = (e) => {
        setActionError(false)
        setNewAction(e.target.value)
    }

    const handleAddAction = (e) => {
        console.log('adding')
        if (newAction === "" || newAction === " ") {
            return
        } else {
            for (let id of Object.keys(pendingGoal.actions)) {
                if (pendingGoal.actions[id].name === newAction) {
                    console.log('duplicate')
                    return
                }
            }
            setPendingGoal({...pendingGoal, actions: {...pendingGoal.actions, [getRandomID()]: {
                name: newAction,
                number: Object.keys(pendingGoal.actions).length
            } }})
            console.log(pendingGoal.actions)
            setNewAction("")
        }
    }

    const removeAction = (k) => {
        let newActions = pendingGoal.actions
        delete newActions[k]
        setPendingGoal({...pendingGoal, actions: newActions})
        
    }

    const handleSummaryChange = (e) => {
        setPendingGoal({...pendingGoal, summary: e.target.value})
    }

    const toggleComplete = async (e) => {
        try {
            await toggleGoalComplete(authUser.uid, params.goalId, currentGoal.complete)
        } catch (err) {
            console.log(err)
        }
    }

    const handleGoalDelete = async (title) => {
        try {
            let newUsersGoals = currentUsersGoals
            delete newUsersGoals[params.goalId]
            await deleteGoal(authUser.uid, params.goalId, newUsersGoals)
            navigate("/viewgoals")
        } catch (error) {
            console.log(error)
        }
    }

 

    return (
        <>
        {pendingGoal && currentGoal && currentUsersGoals && Object.keys(currentUsersGoals).length > 0 && 
        <div className={styles.flexColumn}>

            <div className={styles.row}>
                <label>Title</label>
                <textarea rows={1} value={pendingGoal.title} onChange={e => handleTitleChange(e)}></textarea>
            </div>

            <div className={styles.row}>
                <label>Deadline</label>
                <input type="date" value={pendingGoal.deadline || ""} onChange={e => handleDeadlineChange(e)}></input>
            </div>

            <div className={styles.actions}>

            <label>Actions to achieve {pendingGoal.perPeriodSummary}:
            <ul className={styles.actions}>
            {pendingGoal.actions && Object.entries(pendingGoal.actions).map(([k, v]) => (
                <div key={k} className={styles.row}>
                    <input className={styles.fillFlex} disabled={!editing} type="text" value={pendingGoal.actions[k].name} onChange={e => handleActionChange(e, k)}></input>
                    <p className={styles.icon} onClick={() => removeAction(k, v)}>X</p>
                </div>  
            ))}
            {actionError && <label className="warn">Action already exists</label>}
                <div className={styles.row}>
                    <input className={styles.fillFlex} type="text" value={newAction} onChange={e => handleNewActionChange(e)} onKeyPress={e => {if (e.key === "Enter") {e.preventDefault(); handleAddAction()}}}></input>
                    <p className={`${styles.icon} ${styles.plus}`} onClick={() => handleAddAction()}>+</p>
                </div>
            </ul>
            </label>

            </div>
            
            <div className={`${styles.completeRow} ${currentGoal.complete ? `${styles.completed}` : `${styles.inProgress}`} `}>
                <label>{currentGoal.complete ? "complete" : "In progress"}</label>
                <input className={styles.customCheckbox} type="checkbox" checked={!!currentGoal.complete} onChange={() => toggleComplete()}></input>
            </div>

            
            <label>Summary:</label>
            <textarea className={styles.summary} value={pendingGoal.summary} onChange={e => handleSummaryChange(e)}></textarea>

            <input className={styles.deleteBtn} type="button" value="Delete Goal" onClick={() => handleGoalDelete()}></input>
           
            
        </div>}
        </>
    )
}

export default ViewGoal
