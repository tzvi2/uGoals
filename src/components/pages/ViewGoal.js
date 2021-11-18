import React, {useState} from 'react'

function ViewGoal() {
    const [editing, setEditing] = useState(false)
    return (
        <div>
            <label>title</label>
            <input readOnly={editing} type="text"></input>
        </div>
    )
}

export default ViewGoal
