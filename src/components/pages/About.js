import React from 'react'
import styles from '../../css/About.module.css'

function About() {
    return (
        <div className={styles.flexColumn}>
            <p>uGoals is based on the research of Gail Matthews, a psychology professor at Dominican University.</p>
            <p>She found four ingredients that boost your chances of achieving your goals:</p>
            <ul>
                <li>Writing your goals</li>
                <li>Creating action commitments</li>
                <li>Telling a friend</li>
                <li>Sending progress updates</li>
            </ul>
            <p>uGoals helps you along this process to maximize your chance of success.</p>
            <input className={styles.fullButton} type="button" value="Get Started"></input>
        </div>
    )
}

export default About
