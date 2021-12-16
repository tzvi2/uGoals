import React, {useState, useEffect} from 'react'
import styles from '../css/DueCard.module.css'
import {getMonthAndDay, getCurrentStart, dateInOneWeek, dateInOneMonth} from '../utils/dates'
import { useGoalContext } from '../context/GoalContext'
import { arrayRemove } from '@firebase/firestore'



function DueCard(props) {

    const {actions, setActions, toggleActionComplete} = useGoalContext()
    const [today, setToday] = useState("")
    const [sortedActions, setSortedActions] = useState([])
    //const [sortedCompletedActions, setSortedCompletedActions] = useState([])

    const sortActionsByTime = () => {
        let newSorted = []
        for (let [key, value] of Object.entries(actions[props.period])) {
            newSorted.push({key: key, createdAt: value.createdAt, name: value.name})
        }
        for (let i = 1; i < newSorted.length; i++) {
            let p = i
            while (p > 0 && newSorted[p].createdAt < newSorted[p - 1].createdAt) {
                let temp = newSorted[p - 1]
                newSorted[p - 1] = newSorted[p]
                newSorted[p] = temp
                p--
            }
        }
        setSortedActions(newSorted)
    }

    const actionCreated = (action) => {

    }

    const getValue = (days) => {
        if (days === "day") {
            return new Date().toDateString().slice(0, -4)
        } else if (days === "week") {
            return `${getMonthAndDay(new Date().toDateString())} - ${getMonthAndDay(dateInOneWeek().toDateString())}`
        } else {
            return `${getMonthAndDay(new Date().toDateString())} - ${getMonthAndDay(dateInOneMonth().toDateString())}`
        }
    }

    useEffect(() => {
        //console.log('sortedActions', sortedActions)
    }, [sortedActions])

    const handleToggle = async (k) => {
        try {
            await toggleActionComplete(props.period, k, today, actions[props.period][k][new Date().toDateString()].complete)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        setToday(new Date().toDateString())
        if (props.period) {
            sortActionsByTime()
        }
    }, [actions])

    return (
        <>{actions && actions[props.period] &&
        <div className={styles.card}>
            <div className={styles.row}>
                <input type="button" value={props.period === "day" ? "Today" : props.period === "week" ? "This Week" : "This Month"}></input>
                <input readOnly type="text" value={getValue(props.period)}></input>
            </div>
            {sortedActions.map((action, i) => (
                <div className={styles.row} key={i}>
                    <input type="checkbox" checked={actions[props.period][action.key][getCurrentStart(action, props.period)].complete} onChange={() => handleToggle(action.key)}></input>
                    <label>{action.name}</label>
                </div>
            ))}
        </div>}
        </>
    )
}

export default DueCard
