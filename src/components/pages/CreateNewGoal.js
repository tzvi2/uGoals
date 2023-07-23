import React, {useState, useEffect} from 'react'
import styles from '../../css/CreateNewGoal.module.css'
import ActionsForm from '../forms/ActionsForm'
import GoalConfirmation from './GoalConfirmation'
import {useNavigate} from 'react-router-dom'
import {getDaysBetween, getCalendarComposition, dateStringToUS} from '../../utils/dates'
import {roundToPointFive, roundToPointTwoFive} from '../../utils/math'
import { useGoalContext } from '../../context/GoalContext'
import { useAuthContext } from '../../context/AuthContext'
import {getRandomID} from '../../utils/ids'
import { auth } from '../../config/firebase'
import SignupForm from '../forms/SignupForm'

function CreateNewGoal() {

    const {saveGoal, setCurrentSummary, setCurrentTitle, setPendingGoal, setHasPendingGoal} = useGoalContext()
    const {authUser} = useAuthContext()

    let navigate = useNavigate()

    const [title, setTitle] = useState("")
    
    const [currentNumber, setCurrentNumber] = useState(-1)
    const [targetNumber, setTargetNumber] = useState(0)
    const [showSignUp, setShowSignUp] = useState(false)
    const [next, setNext] = useState(false)
    const [savingGoal, setSavingGoal] = useState(false)

    const [units, setUnits] = useState("")
    const [deadline, setDeadline] = useState(new Date().toLocaleDateString("en-ca"))
    const [daysTillDeadline, setDaysTillDeadline] = useState(0)
    const [splitTime, setSplitTime] = useState("day")
    const [splitNumber, setSplitNumber] = useState(0)
    const [dateError, setDateError] = useState(false)
    const [actions, setActions] = useState({})

    const totalNumber = targetNumber - currentNumber
    const perPeriodSummary = (totalNumber === 0) ? `each ${splitTime} to maintain ${currentNumber} ${units} for ${getCalendarComposition(50)}` : `to achieve ${totalNumber > 0 ? "an increase of" : "a decrease of"} ${splitNumber} ${units} each ${splitTime}`

    const [summary, setSummary] = useState(`Hi, I'm using uGoals to set research-backed goals. A key step is to send my goal and action steps to a peer. \n\nHere's my goal: I will ${title} by ${deadline}. To achieve this I will do ${perPeriodSummary}. I'll send you a quick progress update each ${splitTime}.`)

    useEffect(() => [
        setSummary(`Hi, I'm using uGoals to set research-backed goals. A key step is to send my goal and action steps to a peer. \n\nHere's my goal: I will ${title} by ${dateStringToUS(deadline)}. To achieve this I will do ${perPeriodSummary}. I'll send you a quick progress update each ${splitTime}.`)
    ], [title, deadline, perPeriodSummary, splitTime])

    const newGoal = {
        title: title,
        currentNumber: currentNumber,
        targetNumber: targetNumber,
        deadline: deadline,
        splitTime: splitTime,
        perPeriodSummary: perPeriodSummary,
        actions: actions,
        summary: summary,
        complete: false
    }

    const handleSubmit = async (e) => {
        if(savingGoal) {
            return
        }
        setSavingGoal(true)
        e.preventDefault()
        if (authUser === null) {
            setHasPendingGoal(true)
            setPendingGoal(newGoal)
            setCurrentTitle(newGoal.title)
            navigate('../signup')
            return 
        }
        try {
            await saveGoal(authUser.uid, newGoal)
            setCurrentTitle(title)
            setCurrentSummary(summary)
            setSavingGoal(false)
            navigate("/goalconfirm")
        } catch (error) {
            console.log('errror', error)
        } 
    }


    useEffect(() => {
        if (daysTillDeadline > 21 && daysTillDeadline < 91 ) {
            setSplitTime("week")
        } else if (daysTillDeadline > 91) {
            setSplitTime("month")
        } else {
            setSplitTime("day")
        }
    }, [daysTillDeadline])
    
    useEffect(() => {

        let tempNum = 0
        switch (splitTime) {
            case "day":
                tempNum = totalNumber / daysTillDeadline
                break
            case "week":
                tempNum = (totalNumber / daysTillDeadline) * 7
                break
            case "month":
                tempNum = (totalNumber / daysTillDeadline) * 30
                break 
        }
        if (totalNumber > -10 && totalNumber <= 10) {
            setSplitNumber(roundToPointTwoFive(tempNum))
        } else {
            setSplitNumber(roundToPointFive(tempNum))
        }
        
    }, [totalNumber, splitTime, daysTillDeadline])

    const handleDateChange = (e) => {
        setDateError(false)
        let currentDate = new Date()
        if (getDaysBetween(currentDate, new Date(e.target.value)) < 0 ) {
            setDateError(true)
        } else {
            setDaysTillDeadline(getDaysBetween(currentDate, new Date(e.target.value)))
            setDeadline(e.target.value)
        }
    }

 

    return (
        <>
        
        <form className={styles.newGoalForm} onSubmit={e => handleSubmit(e)}>
            
            <div className={styles.section}>
                <label>Create a measurable goal.</label>
                <input autoFocus type="text" placeholder="e.g. Increase revenue to $10,000/month" onChange={e => setTitle(e.target.value)}></input>
            </div>
            {title && <div className={styles.row}>

                <div className={styles.col}>
                    <label>Current number:</label>
                    <input type="number" placeholder="e.g. 7,500" onChange={e => setCurrentNumber(parseInt(e.target.value))}></input> 
                </div>
                {currentNumber >= 0 && 
                <div className={styles.col}>
                    <label>Target number:</label>
                    <input type="number" placeholder="e.g. 10,000" onChange={e => setTargetNumber(parseInt(e.target.value))}></input> 
                </div>}

            </div>}
            {targetNumber > 0 && <div className={styles.section}>
                <label>What is your unit of measurement?</label>
                <input type="text" placeholder="e.g. dollars, lbs, ..." onChange={e => setUnits(e.target.value)}></input>
            </div>}
            {units && <div className={styles.section}>
                <label>When is your deadline? {dateError && <p className="warn">Invalid date</p>}</label>
                <input type="date" value={deadline} onChange={e => handleDateChange(e)}></input>
            </div>}
            {deadline != new Date().toLocaleDateString("en-ca") && <div className={styles.section}>
                <label>Next, make some action commitments. What will I do {perPeriodSummary}:</label>
                <ActionsForm actions={actions} setActions={setActions}/>
            </div>}
            {Object.keys(actions).length > 0 && <div className={styles.section}>
                {/* <label>Finally, save your goal:</label> */}
                {!next && <input type="button" value="Next" onClick={() => setNext(true)}></input>}
            </div>}
            {next && <div className={styles.confirmation}>
                <p >The next step is important. Copy your summary and send it to a friend through your preferred method...</p>
                <textarea className={styles.summary} value={summary} onChange={e => setSummary(e.target.value)}></textarea>
                <label>Finally, save your goal:</label>
                <input className={styles.saveGoal} type="button" value="Save goal" onClick={(e) => handleSubmit(e)}></input>
        </div>}
            
        </form>
      </> 
    )
}

export default CreateNewGoal
