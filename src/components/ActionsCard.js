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
        //console.log('props.data', props.data)
        let completed = []
        let inProgress = []
        for (let [key, value] of Object.entries(props.data)) {

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
            console.log(arr[i])
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

    useEffect(() => {
        console.log('sortedActions', sortedActions)
    }, [sortedActions])

    const handleToggle = async (k) => {
        console.log('handling toggle')
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
        
        // if (today && Object.keys(props.data).length > 0) {
        //     handleSorting()
        // }
        //console.log('props.data', props.data)
        if (Object.keys(props.data).length > 0) {
            handleSorting()
        }
        
    }, [props.data])

    return (
        <>{
        <div className={styles.card}>
            <div className={styles.row}>
                <input type="button" value={props.period === "day" ? "Today" : props.period === "week" ? "This Week" : "This Month"}></input>
                <input readOnly type="text" value={getValue(props.period)}></input>
            </div>
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
        </div>}
        </>
    )
}

export default ActionsCard
