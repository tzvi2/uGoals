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
        window.scrollTo(0,document.body.scrollHeight);
    }

    const removeAction = (id) => {
        console.log('removing')
        for (let key of Object.keys(props.actions)) {
            if (key === id) {
                let newActionState = props.actions
                delete newActionState[key]
                props.setActions({...newActionState})
            }
        }
    }

    useEffect(() => {
        //console.log('props.action',props.actions)
    }, [props.actions])

    return (
        <div className={styles.actions}>

            {Object.keys(props.actions).map(k => (
                <div key={k} className={styles.row}>
                    <label className={styles.saved}>{props.actions[k]}</label>
                    <input type="button" value="X" onClick={() => removeAction(k)}></input>
                </div>
            ))}

            <div className={styles.section}>
                {actionError && <label className={styles.warn}>Action already exists</label>}
                <div className={styles.row}>
                    <input autoFocus type="text" value={actionName} onChange={e => handleActionChange(e)} onKeyPress={e => {if (e.key === "Enter") {addAction()}}}></input>
                    <img className={styles.icon} src={check} onClick={addAction}></img>
                </div>
            </div>
            
        </div>
    )
}

export default ActionsForm
