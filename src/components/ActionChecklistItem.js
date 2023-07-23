import React, {useEffect} from 'react'
import styles from '../css/ActionsCard.module.css'
import { useGoalContext } from '../context/GoalContext'
import { getCurrentStart } from '../utils/dates'

function ActionChecklistItem(props) {

    const {toggleActionComplete} = useGoalContext()

    const handleToggle = async () => {
        try {
            await toggleActionComplete(props.period, props.actionID, props.currentStart, props.complete)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <input type="checkbox" checked={props.complete} onChange={() => handleToggle()}></input>
            <label>{props.name}</label>
        </>
    )
}

export default ActionChecklistItem
