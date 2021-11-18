import React, {useState} from 'react'
import styles from '../../css/CreateNewGoal.module.css'
import ActionsForm from '../forms/ActionsForm'
import GoalConfirmation from './GoalConfirmation'
import {useNavigate} from 'react-router-dom'

function CreateNewGoal() {

    let navigate = useNavigate()

    const [title, setTitle] = useState("")
    const [totalNumber, setTotalNumber] = useState(0)
    const [units, setUnits] = useState("")
    const [deadline, setDeadline] = useState(new Date().toLocaleDateString("en-ca"))
    const [actions, setActions] = useState({})

    let daysTillDeadline = 0
    let splitTime = "week"
    const perPeriodSummary = `${totalNumber} ${units} each ${splitTime}`
    const summary = `Hi, I'm using uGoals to set research-backed goals. A key step is to send the goal and action steps to a peer. Here's mine: I will achieve ${totalNumber} ${units} by ${deadline}. To achieve this I will do ${perPeriodSummary}`

    const newGoal = {
        title: title,
        totalNumber: totalNumber,
        deadline: deadline,
        perPeriodSummary: perPeriodSummary,
        actions: actions
    }

    return (
        <form className={styles.flexColumn} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.section}>
                <label>Create a measurable goal.</label>
                <input type="text" placeholder="e.g. Increase revenue by $10,000"></input>
            </div>
            <div className={styles.section}>
                <label>What is the total number you're trying to achieve?</label>
                <input type="number" placeholder="e.g. 10,000"></input>
            </div>
            <div className={styles.section}>
                <label>What is your unit of measurement?</label>
                <input type="text" placeholder="e.g. dollars, lbs, ..."></input>
            </div>
            <div className={styles.section}>
                <label>When is your deadline?</label>
                <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}></input>
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
    )
}

export default CreateNewGoal
