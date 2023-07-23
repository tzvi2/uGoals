import React from 'react'
import styles from '../css/Footer.module.css'

function Footer() {
    return (
        <footer className={`${styles.footer}`}>
            <div className={styles.col}>
                <p>&#xA9; 2021</p>
            </div>
            
        </footer>
    )
}

export default Footer
