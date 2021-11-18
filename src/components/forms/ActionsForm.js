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
        if (actionName === "") {
            return 
        } 
        for (let id of Object.keys(props.actions)) {
            if (props.actions[id] === actionName) {
                setActionError(true)
                return
            }
        }
        let newActionState = {...props.actions, [getRandomID()] : actionName}
        props.setActions(newActionState)
        setActionName("")
    }

    useEffect(() => {
        console.log(props.actions)
    }, [props.actions])

    return (
        <div className={styles.actions}>

            {/* {props.actions.map(action => (
                <div key={action.id} className={styles.row}>
                    <label className={styles.saved}>{action.name}</label>
                    <input type="button" value="X"></input>
                </div>
            ))} */}

            <div className={styles.section}>
                {actionError && <label className={styles.warn}>Action already exists</label>}
                <div className={styles.row}>
                    <input type="text" value={actionName} onChange={e => handleActionChange(e)} onKeyPress={e => {if (e.key === "Enter") {addAction()}}}></input>
                    <img className={styles.icon} src={check} onClick={addAction}></img>
                </div>
            </div>
            
        </div>
    )
}

export default ActionsForm
