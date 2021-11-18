import React, {useState} from 'react'
import styles from '../../css/ViewGoals.module.css'
import GoalCard from '../GoalCard'

function ViewGoals() {
    return (
        <div className={styles.flexColumn}>
            <GoalCard />
            <GoalCard />
            <GoalCard />
            <GoalCard />
        </div>
    )
}

export default ViewGoals
