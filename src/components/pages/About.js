import React from 'react'
import styles from '../../css/About.module.css'

function About() {
    return (
        <div className="flexRow">
        <div className={`flexColumn ${styles.flexColumn}`}>
            <p>uGoals is based on the research of Gail Matthews, a psychology professor at Dominican University.</p>
            <p><a href="https://www.dominican.edu/sites/default/files/2020-02/gailmatthews-harvard-goals-researchsummary.pdf" target="_blank">She found four ingredients</a> that boost your chances of achieving your goals:</p>
            <ul>
                <li>Writing your goals</li>
                <li>Creating action commitments</li>
                <li>Telling a friend</li>
                <li>Sending progress updates</li>
            </ul>
            <p>uGoals helps you along this process to maximize your chance of success.</p>
            <input className={styles.fullButton} type="button" value="Get Started"></input>
        </div>
        </div>
    )
}

export default About
