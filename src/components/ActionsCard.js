import React, {useState, useEffect} from 'react'
import styles from '../css/ActionsCard.module.css'
import {getMonthAndDay, getCurrentStart, dateInOneWeek, dateInOneMonth} from '../utils/dates'
import { useGoalContext } from '../context/GoalContext'
import ActionChecklistItem from './ActionChecklistItem'



function ActionsCard(props) {

    const {actions, toggleActionComplete} = useGoalContext()
    const [today, setToday] = useState("")
    const [sortedActions, setSortedActions] = useState([])

    const handleSorting = () => {
        let completed = []
        let inProgress = []
        for (let [key, value] of Object.entries(props.data)) {
            console.log("props.data[key]", props.data[key])
            console.log("props.period", props.period)
            console.log("getCurrentStart(props.data[key], props.period)", getCurrentStart(props.data[key], props.period))
            if (props.data[key][getCurrentStart(props.data[key], props.period)].complete) {
                completed.push({id: key, ...value})
            } else {
                inProgress.push({id: key, ...value})
            }
        }
        setSortedActions([...sortByCreationTime(inProgress), ...sortByCreationTime(completed)])
    }

    const sortByCreationTime = (arr) => {
        console.log('sorting by creation', arr)
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


    const getValue = (days) => {
        if (days === "day") {
            return new Date().toDateString().slice(0, -4)
        } else if (days === "week") {
            return `${getMonthAndDay(new Date().toDateString())} - ${getMonthAndDay(dateInOneWeek().toDateString())}`
        } else {
            return `${getMonthAndDay(new Date().toDateString())} - ${getMonthAndDay(dateInOneMonth().toDateString())}`
        }
    }

    const handleToggle = async (k) => {
        try {
            await toggleActionComplete(props.period, k, today, props.data[k][new Date().toDateString()].complete)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        setToday(new Date().toDateString())
    }, [])

    useEffect(() => {
        if (Object.keys(props.data).length > 0) {
            console.log('props.data', props.data)
            handleSorting()
        }
    }, [props.data])

    return (
        <>{
        <div className={`${styles.card} card`}>
            <div className={styles.top}>
                <input type="button" value={props.period === "day" ? "Today" : props.period === "week" ? "This Week" : "This Month"}></input>
                <input readOnly type="text" value={getValue(props.period)}></input>
            </div>

            <div className={styles.bottom}>
            {sortedActions.map((obj, i) => (
                <div className={styles.row} key={i}>
                    <ActionChecklistItem 
                        name={obj.name}
                        complete={obj[getCurrentStart(obj, props.period)].complete}
                        actionID={obj.id}
                        currentStart={getCurrentStart(obj, props.period)}
                        period={props.period}
                    />
                </div>
            ))}
            </div>
        </div>}
        </>
    )
}

export default ActionsCard
