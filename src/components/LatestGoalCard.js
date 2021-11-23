import React from 'react'
import styles from '../css/LatestGoalCard.module.css'

function LatestGoalCard() {
    return (
        <div className={styles.outer}>
            <label>Latest...</label>
            <div className={styles.latestGoalCard}>
                <label>Eat 10 hotdogs by May 31st</label>
                <label>May 31, 2023</label>
                <ul>
                    <li>Buy the buns</li>
                    <li>also the hotdogs</li>
                    <li>open the grill</li>
                    <li>make a bunch of hotdogs to achieve this wonderful goal</li>
                </ul>
                <label>2.5 months remaining</label>
            </div>
        </div>
    )
}

export default LatestGoalCard
