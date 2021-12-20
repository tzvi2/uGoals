import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react'
import styles from '../../css/ViewGoal.module.css'
import { useGoalContext } from '../../context/GoalContext'
import { useAuthContext } from '../../context/AuthContext'
import {useParams, useNavigate, useLocation, Link} from 'react-router-dom'
import {debounce} from 'lodash'
import { getRandomID } from '../../utils/ids'
import { removeTrailingWhiteSpace } from '../../utils/strings'

function ViewGoal(props) {

    let params = useParams()
    let navigate = useNavigate()

    const {authUser} = useAuthContext()
    const {pendingGoal, setPendingGoal, currentUsersGoals, setSecondsRemaining, currentGoalId, setCurrentGoalId, findGoalWithTitle, toggleGoalComplete, deleteGoal, removeAction, setJustOpenedGoal} = useGoalContext()

    const [actionNames, setActionNames] = useState({})
    const [actionError, setActionError] = useState(false)
    const [newAction, setNewAction] = useState("")
    const [loading, setLoading] = useState(true)

    let first = true
    
    useEffect(() => {
        
        if (first && currentUsersGoals && Object.keys(currentUsersGoals).length > 0){
            Object.entries(currentUsersGoals).map(([k, v], i) => {
                if (v.title === params.goalTitle) {
                    console.log('v (setting pending, actionNames, currentGoalId', v)
                    setPendingGoal(v)
                    setActionNames(v.actions)
                    setCurrentGoalId(k)
                }
            })
            setLoading(false)
            first = false
        }
    }, [currentUsersGoals])


    const handleTitleChange = (e) => {
        setJustOpenedGoal(false)
    }

    const handleDeadlineChange = (e) => {
        setJustOpenedGoal(false)

    }

    const handleSummaryChange = (e) => {
        setJustOpenedGoal(false)
    }

    const toggleComplete = async (e) => {
        try {
            await toggleGoalComplete(authUser.uid, currentGoalId, pendingGoal.complete)
        } catch (err) {
            console.log(err)
        }
    }

    const handleGoalDelete = async () => {
        console.log("handling Goal delete")
        try {
            await deleteGoal(currentGoalId)
            navigate("/viewgoals")
        } catch (error) {
            console.log(error)
        }
    }

    // * * * 
    useEffect(() => {
        
    }, [])

    const handleActionChange = (e, key) => {
        setJustOpenedGoal(false)
        // console.log("e.target.value", e.target.value)
        // console.log("key", key)
        // console.log("actionNames[key]", actionNames[key])
        setActionNames({...actionNames, [key]: {...actionNames[key], name: e.target.value}})
        save(e, key)
    }

    const setPending = (obj) => {
        console.log('setting pending goal')
        setPendingGoal({...pendingGoal, actions: {...obj}})
        // setPendingGoal({...pendingGoal, actions: actionNames})
    }
    
    const save = useCallback(
        debounce((e, key) => {
            console.log("e.target.value", e.target.value)
            console.log("key", key)
            console.log("pendingGoal", pendingGoal)
            console.log("pendingGoal.actions", pendingGoal.actions)
            console.log("pendingGoal.actions[key]", pendingGoal.actions[key])
            const newActions = {...pendingGoal.actions, [key]: {...pendingGoal.actions[key], name: e.target.value}}
            // setPending(newActions)
            setPendingGoal({...pendingGoal, actions: newActions})
            setSecondsRemaining(2)
        }, 500)
        , [pendingGoal]
    )

    const handleActionRemove = (key) => {
        setJustOpenedGoal(false)
        let copy = {...actionNames}
        delete copy[key]
        setActionNames(copy)
        setPendingGoal({...pendingGoal, actions: copy})
        removeAction(pendingGoal.splitTime, key)
    }

    const addAction = (e) => {
        setJustOpenedGoal(false)
        if (removeTrailingWhiteSpace(newAction).length === 0) {
            return
        }
        for (let key of Object.keys(actionNames)) {
            if (actionNames[key].name === newAction) {
                setActionError(true)
                return
            }
        }
        let newActions = {...actionNames, [getRandomID()]: {
            name: newAction,
            number: Object.keys(actionNames).length,
            createdAt: new Date().getTime()
        }}
        setActionNames(newActions)
        setPendingGoal({...pendingGoal, actions: newActions})
        setNewAction("")
    }

    // * * *

    return (
        <div className={styles.outer}>
        <button className={styles.backBtn}><Link to="../viewgoals">Back</Link></button>
        {currentGoalId && <div className={styles.flexColumn}>

            <div className={styles.row}>
                <label>Title</label>
                <textarea rows={1} value={pendingGoal.title} onChange={e => {}}></textarea>
            </div>

            <div className={styles.row}>
                <label>Deadline</label>
                <input type="date" value={pendingGoal.deadline || ""} onChange={e => {}}></input>
            </div>

            <div className={styles.actions}>

            <label>Actions to achieve {""}:
            <ul className={styles.actions}>
                {actionNames && Object.keys(actionNames).map((key, i) => (
                   <div key={key} className={styles.row}>
                    <input autoFocus={false} className={styles.fillFlex} type="text" value={actionNames[key].name} onChange={e => handleActionChange(e, key)}></input>
                    <p className={styles.icon} onClick={() => handleActionRemove(key)}>X</p>
                </div> 
                ))}
 
            {actionError && <label className="warn">Action already exists</label>}
                <div className={styles.row}>
                    <input autoFocus={false} className={styles.fillFlex} type="text" value={newAction} onChange={e => {setActionError(false); setNewAction(e.target.value)}} onKeyPress={e => {if (e.key === "Enter") {e.preventDefault(); addAction(e)}}}></input>
                    <p className={`${styles.icon} ${styles.plus}`} onClick={(e) => addAction(e)}>+</p>
                </div>
            </ul>
            </label>

            </div>

            <div className={`${styles.completeRow} ${pendingGoal.complete ? `${styles.completed}` : `${styles.inProgress}`} `}>
                <label>{pendingGoal.complete ? "complete" : "In progress"}</label>
                <input className={styles.customCheckbox} type="checkbox" checked={!!pendingGoal.complete} onChange={() => toggleComplete()}></input>
            </div>

            <label>Summary:</label>
            <textarea className={styles.summary} value={pendingGoal.summary} onChange={e => handleSummaryChange(e)}></textarea>

            <input className={styles.deleteBtn} type="button" value="Delete Goal" onClick={() => handleGoalDelete()}></input>

        </div>}

        {!currentGoalId && !loading && <>
            <div className={styles.nOtFoUnD}>
                <p className={styles.notFound}>404</p>
                <p>Goal not found. Double check the URL.</p>
            </div>

        </>}
        </div>
    )
}

export default ViewGoal
