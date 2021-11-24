import React from 'react'
import styles from '../../css/About.module.css'

function About() {
    return (
        <>
            <p>uGoals guides you through an ideal goal setting process. The process is based on the research of Gail Matthews, a psychology professor at Dominican University.</p>
            <p className="tan wide"><a href="https://www.dominican.edu/sites/default/files/2020-02/gailmatthews-harvard-goals-researchsummary.pdf" target="_blank">Dr. Matthews found four factors</a> that boost the probability of achieving your goals:</p>
            <ul className="tan">
                <li>Writing your goals</li>
                <li>Creating action commitments</li>
                <li>Telling a friend</li>
                <li>Sending progress updates</li>
            </ul>
            <p>uGoals helps you along this process to maximize your chance of success.</p>
            <a className={styles.signUp} href="/signup">Get Started</a>
        </>
    )
}

export default About
