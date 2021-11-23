import React, {useState, useEffect} from 'react'
import styles from '../../css/CreateNewGoal.module.css'
import ActionsForm from '../forms/ActionsForm'
import GoalConfirmation from './GoalConfirmation'
import {useNavigate} from 'react-router-dom'
import {getDaysBetween} from '../../utils/dates'
import {roundToPointFive} from '../../utils/math'
import { useGoalContext } from '../../context/GoalContext'
import {getRandomID} from '../../utils/ids'

function CreateNewGoal() {

    const {saveGoal, setCurrentGoal} = useGoalContext()

    let navigate = useNavigate()

    const [title, setTitle] = useState("")
    const [totalNumber, setTotalNumber] = useState(0)
    const [units, setUnits] = useState("")
    const [deadline, setDeadline] = useState(new Date().toLocaleDateString("en-ca"))
    const [daysTillDeadline, setDaysTillDeadline] = useState(0)
    const [splitTime, setSplitTime] = useState("day")
    const [splitNumber, setSplitNumber] = useState(0)
    const [dateError, setDateError] = useState(false)
    const [actions, setActions] = useState({})

    
    
    const perPeriodSummary = `${splitNumber} ${units} each ${splitTime}`
    const summary = `Hi, I'm using uGoals to set research-backed goals. A key step is to send the goal and action steps to a peer. Here's mine: I will ${title} by ${deadline}. To achieve this I will do ${perPeriodSummary}.`

    const newGoal = {
        title: title,
        totalNumber: totalNumber,
        deadline: deadline,
        perPeriodSummary: perPeriodSummary,
        actions: actions,
        summary: summary,
        complete: false
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(newGoal)
        try {
            await saveGoal(newGoal)
            setCurrentGoal(newGoal)
            navigate("/goalconfirm")
        } catch (error) {
            console.log('errror', error)
        }
        
    }

    useEffect(() => {
        //console.log('days till deadline', daysTillDeadline, "setting splitTime")
        if (daysTillDeadline > 21 && daysTillDeadline < 91 ) {
            //console.log('> 21 && < 91')
            setSplitTime("week")
        } else if (daysTillDeadline > 91) {
            //console.log('> 91')
            setSplitTime("month")
        } else {
            setSplitTime("day")
        }
    }, [daysTillDeadline])
    
    // on total number channge, calculte number per split time (split number)
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
        setSplitNumber(roundToPointFive(tempNum))
    }, [totalNumber, splitTime, daysTillDeadline])

    useEffect(() => {
        //console.log('splitNumber', splitNumber)
    }, [splitNumber])

    useEffect(() => {
        //console.log('splitTime was changed', splitTime)
    }, [splitTime])

    const handleDateChange = (e) => {
        setDateError(false)
        let currentDate = new Date()
        if (getDaysBetween(currentDate, new Date(e.target.value)) < 1 ) {
            setDateError(true)
        } else {
            setDaysTillDeadline(getDaysBetween(currentDate, new Date(e.target.value)))
            setDeadline(e.target.value)
        }
    }

    return (
        <div className="flexRow">
        <form className="flexColumn" onSubmit={e => handleSubmit(e)}>
            <div className={styles.section}>
                <label>Create a measurable goal.</label>
                <input type="text" placeholder="e.g. Increase revenue by $10,000" onChange={e => setTitle(e.target.value)}></input>
            </div>
            <div className={styles.section}>
                <label>Total number of improvement:</label>
                <input type="number" placeholder="e.g. 10,000" onChange={e => setTotalNumber(e.target.value)}></input>
            </div>
            <div className={styles.section}>
                <label>What is your unit of measurement?</label>
                <input type="text" placeholder="e.g. dollars, lbs, ..." onChange={e => setUnits(e.target.value)}></input>
            </div>
            <div className={styles.section}>
                <label>When is your deadline? {dateError && <span className={styles.warn}>Invalid date</span>}</label>
                <input type="date" value={deadline} onChange={e => handleDateChange(e)}></input>
            </div>
            <div className={styles.section}>
                <label>Next, create some action commitments. What will I do to achieve {perPeriodSummary}:</label>
                <ActionsForm actions={actions} setActions={setActions}/>
            </div>
            <div className={styles.section}>
                <label>Finally, save your goal:</label>
                <input type="submit" value="Save"></input>
            </div>

            
        </form>
        </div>
    )
}

export default CreateNewGoal
