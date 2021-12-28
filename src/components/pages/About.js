import React from 'react'
import styles from '../../css/About.module.css'
import { useAuthContext } from '../../context/AuthContext'

function About() {
    const {authUser} = useAuthContext()
    return (
        <div className={styles.aboutPage}>
            <p className={styles.about}><strong>uGoals</strong> is a goal-manager that increases your chances of success by guiding you through an ideal goal-setting process. The process is based on research conducted by Gail Matthews, a psychology professor at Dominican University.</p>
            <p className={styles.about}><a className={styles.about} href="https://www.dominican.edu/sites/default/files/2020-02/gailmatthews-harvard-goals-researchsummary.pdf" target="_blank">Dr. Matthews found four factors</a> that boost the probability of achieving your goals:</p>
            <ul className={styles.wide}>
                <li>Writing your goals,</li>
                <li>Creating action commitments,</li>
                <li>Telling a friend, and</li>
                <li>Sending progress updates.</li>
            </ul>
            <p className={styles.about}><strong>uGoals</strong> helps you along this process to maximize your chance of success.</p>
            {authUser === null &&<a className={styles.signUp} href="/signup">Get Started</a>}
        </div>
    )
}

export default About
