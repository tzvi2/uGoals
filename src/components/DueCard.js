import { getByDisplayValue } from '@testing-library/dom'
import React, {useState} from 'react'
import styles from '../css/DueCard.module.css'
import {getMonthAndDay, dateStringToUS, dateInOneWeek, dateInOneMonth} from '../utils/dates'


function DueCard(props) {

    //const [dueActions, setDueActions] = useState({})

    const toggleActionComplete = () => {

    }


    const getValue = (days) => {
        if (days === 1) {
            return new Date().toDateString().slice(0, -4)
        } else if (days === 7) {
            return `${getMonthAndDay(new Date().toDateString())} - ${getMonthAndDay(dateInOneWeek().toDateString())}`
        } else {
            return `${getMonthAndDay(new Date().toDateString())} - ${getMonthAndDay(dateInOneMonth().toDateString())}`
        }
    }


    //console.log("props.actions", props.actions)
    return (
        <div className={styles.card}>
            <div className={styles.row}>
                <input type="button" value={props.days === 1 ? "Today" : props.days === 7 ? "This Week" : "This Month"}></input>
                <input readOnly type="text" value={getValue(props.days)}></input>
            </div>
            {Object.entries(props.actions).map(([k, v], i) => (
                <div className={styles.row} key={i}>
                    <input type="checkbox" onChange={() => toggleActionComplete()}></input>
                    <label>{v.name}</label>
                </div>
            ))}
        </div>
    )
}

export const renderDueActions = (k, v, i) => {
    switch (k) {

    }
}


export default DueCard
