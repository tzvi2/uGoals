import React, {useState} from 'react'
import styles from '../../css/ViewGoal.module.css'

function ViewGoal() {
    const [newTitle, setNewTitle] = useState("")

    const newGoal = {
        title: ""
    }

    const [editing, setEditing] = useState(false)
    const [changed, setChanged] = useState(false)

    const handleTitleChange = (e) => {
        setNewTitle(e.target.value)
        if (e.target.value !== newGoal.title) {
            setChanged(true)
        } else {
            setChanged(false)
        }
    }

    return (
        <div className={styles.flexColumn}>

            <button className={`${styles.editButton} ${editing ? `${styles.editing}` : ""} `} onClick={() => setEditing(!editing)}>Edit</button>

            <div className={styles.flexRow}>
                <label>Title</label>
                <input readOnly={!editing} autoFocus={editing} value={newTitle} type="text" onChange={e => handleTitleChange(e)}></input>
            </div>

            <div className={styles.flexRow}>
                <label>Deadline</label>
                <input readOnly type="date" value={"August 35, 1932"}></input>
            </div>

            {/* <div className={styles.flexRow}>
                <label>title</label>
                <input readOnly type="text"></input>
            </div> */}

            {changed && <input className={styles.saveButton} type="button" value="Save"></input>}
            
        </div>
    )
}

export default ViewGoal
