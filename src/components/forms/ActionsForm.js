import React, {useEffect, useState} from 'react'
import styles from '../../css/CreateNewGoal.module.css'
import check from '../../images/check.png'
import {getRandomID} from '../../utils/ids'

function ActionsForm(props) {
    const [actionName, setActionName] = useState("")
    const [actionError, setActionError] = useState(false)

    const handleActionChange = (e) => {
        setActionError(false)
        setActionName(e.target.value)
    }

    const addAction = () => {
        const milliseconds = new Date().getTime()
        if (actionName === "") {
            return 
        } 
        for (let id of Object.keys(props.actions)) {
            if (props.actions[id].name === actionName) {
                setActionError(true)
                return
            }
        }
        let newAction = {
                name: actionName, 
                number: Object.keys(props.actions).length,
                createdAt: milliseconds
            }
        
        props.setActions({...props.actions, [getRandomID()]: newAction})
        setActionName("")
    }

    const removeAction = (id) => {
        for (let key of Object.keys(props.actions)) {
            if (key === id) {
                let newActionState = props.actions
                delete newActionState[key]
                props.setActions({...newActionState})
            }
        }
    }

    return (
        <div className={styles.actions}>
        
            {Object.keys(props.actions).map(k => (
                <div key={k} className={styles.row}>
                    <label className={styles.saved}>{props.actions[k].name}</label>
                    <input className={`${styles.icon} ${styles.x}`} type="button" value="X" onClick={() => removeAction(k)}></input>
                </div>
                
            ))}

            
            {actionError && <label className="warn">Action already exists</label>}
            <div className={`${styles.row} ${styles.newAction}`}>
                <input className={`${styles.actionField}`} type="text" value={actionName} onChange={e => handleActionChange(e)} onKeyPress={e => {if (e.key === "Enter") {e.preventDefault(); addAction()}}}></input>
                <p className={`${styles.icon} ${styles.plus}`} type="button" value="+" onClick={() => addAction()}>+</p>
            </div>
            
            
        </div>
    )
}

export default ActionsForm
