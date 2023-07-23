import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react'
import styles from '../../css/ViewGoal.module.css'
import { useGoalContext } from '../../context/GoalContext'
import { useAuthContext } from '../../context/AuthContext'
import {useParams, useNavigate, useLocation, Link} from 'react-router-dom'
import {debounce} from 'lodash'
import { getRandomID } from '../../utils/ids'
import { getCurrentStart } from '../../utils/dates'
import { removeTrailingWhiteSpace } from '../../utils/strings'

function ViewGoal(props) {

    let params = useParams()
    let navigate = useNavigate()

    const {authUser} = useAuthContext()
    const {pendingGoal, setPendingGoal, currentUsersGoals, setSecondsRemaining, currentGoalId, setCurrentGoalId, findGoalWithTitle, toggleGoalComplete, deleteGoal, removeAction, setJustOpenedGoal, actions, setActions} = useGoalContext()

    const [currentTitle, setCurrentTitle] = useState("")
    const [currentSummary, setCurrentSummary] = useState("")
    const [currentActions, setCurrentActions] = useState({})
    const [actionError, setActionError] = useState(false)
    const [newAction, setNewAction] = useState("")
    const [loading, setLoading] = useState(true)
    const [sortedActions, setSortedActions] = useState([])

    let first = true

    const handleSorting = () => {
        let arr = []
        for (let [key, value] of Object.entries(currentActions)) {
            arr.push({id: key, name: value.name, createdAt: value.createdAt})
        }
        setSortedActions(sortByCreationTime(arr))
    }

    const sortByCreationTime = (arr) => {
        for (let i = 1; i < arr.length; i++) {
            let p = i
            while (p > 0 && arr[p].createdAt < arr[p - 1].createdAt) {
                let temp = arr[p - 1]
                arr[p - 1] = arr[p]
                arr[p] = temp
                p--
            }
        }
        return arr
    }

    const handleTitleChange = (title) => {
        setJustOpenedGoal(false)
        setCurrentTitle(title)
        debouncedSaveTitle(title)
    }


    const handleDeadlineChange = (e) => {
        setJustOpenedGoal(false)
        setPendingGoal({...pendingGoal, deadline: e.target.value})
    }

    const handleSummaryChange = (e) => {
        setJustOpenedGoal(false)
        setCurrentSummary()
        debouncedSaveSummary(e.target.value)

    }

    const toggleComplete = async (e) => {
        try {
            await toggleGoalComplete(authUser.uid, currentGoalId, pendingGoal.complete)
        } catch (err) {
            console.log(err)
        }
    }

    const handleGoalDelete = async () => {
        try {
            await deleteGoal(currentGoalId, pendingGoal.complete)
            navigate("/viewgoals")
        } catch (error) {
            console.log(error)
        }
    }

    const handleActionChange = (e, key) => {
        setJustOpenedGoal(false)
        setCurrentActions({...currentActions, [key]: {...currentActions[key], name: e.target.value}})
        save(e, key)
    }
    
    const save = useCallback(
        debounce((e, key) => {
            const newActions = {...pendingGoal.actions, [key]: {...pendingGoal.actions[key], name: e.target.value}}
            // setPending(newActions)
            setPendingGoal({...pendingGoal, actions: newActions})
            setSecondsRemaining(2)
        }, 500)
        , [pendingGoal]
    )

    const debouncedSaveTitle = useCallback(
        debounce((text) => {
            setPendingGoal({...pendingGoal, title: text})
            setSecondsRemaining(2)
        }, 500)
        , [pendingGoal]
    )

    const debouncedSaveSummary = useCallback(
        debounce((text) => {
            setPendingGoal({...pendingGoal, summary: text})
            setSecondsRemaining(2)
        }, 500)
        , [pendingGoal]
    )

    const handleActionRemove = (key) => {
        setJustOpenedGoal(false)
        let copy = {...currentActions}
        delete copy[key]
        setCurrentActions(copy)
        setPendingGoal({...pendingGoal, actions: copy})
        removeAction(pendingGoal.splitTime, key)
    }

    const addAction = (e) => {
        setJustOpenedGoal(false)
        if (removeTrailingWhiteSpace(newAction).length === 0) {
            return
        }
        for (let key of Object.keys(currentActions)) {
            if (currentActions[key].name === newAction) {
                setActionError(true)
                return
            }
        }
        let newActions = {...currentActions, [getRandomID()]: {
            name: newAction,
            number: Object.keys(currentActions).length,
            createdAt: new Date().getTime()
        }}
        setCurrentActions(newActions)
        setPendingGoal({...pendingGoal, actions: newActions})
        setNewAction("")
        setSecondsRemaining(2)
    }

    useEffect(() => {
    
        if (first && currentUsersGoals && Object.keys(currentUsersGoals).length > 0){
            Object.entries(currentUsersGoals).map(([k, v], i) => {
                if (v.title === params.goalTitle) {
                    setPendingGoal(v)
                    setCurrentActions(v.actions)
                    setCurrentGoalId(k)
                    setCurrentTitle(v.title)
                    setCurrentSummary(v.summary)
                }
            })
            setLoading(false)
            first = false
        }
    }, [currentUsersGoals])

    useEffect(() => {
        if (currentActions && Object.keys(currentActions).length > 0 && Object.keys(actions).length > 0 ) {
            handleSorting()
        }
    }, [currentActions])

    return (
        <div className={styles.outer}>
        <button className={styles.backBtn}><Link to="../viewgoals">Back</Link></button>
        {currentGoalId && <div className={styles.flexColumn}>

            <div className={styles.row}>
                <label>Title</label>
                <textarea rows={1} value={currentTitle} onChange={e => handleTitleChange(e.target.value)}></textarea>
            </div>

            <div className={styles.row}>
                <label>Deadline</label>
                <input type="date" value={pendingGoal.deadline || ""} onChange={e => {}}></input>
            </div>

            <div className={styles.actions}>

            <label>Actions to achieve {""}:
            <ul className={styles.actions}>
                {sortedActions && sortedActions.map((action, i) => (
                   <div key={i} className={styles.row}>
                    <input autoFocus={false} className={styles.fillFlex} type="text" value={action.name} onChange={e => handleActionChange(e, action.id)}></input>
                    <p className={styles.icon} onClick={() => handleActionRemove(action.id)}>X</p>
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
            <textarea className={styles.summary} value={currentSummary} onChange={e => handleSummaryChange(e)}></textarea>

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
