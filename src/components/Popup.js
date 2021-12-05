import React, {useState} from 'react'
import { useEffect } from 'react/cjs/react.development'
import styles from '../css/Popup.module.css'
import check from '../images/check.png'

function Popup({text}) {
    
    return (
        <>
        <p>{text}</p>
        </>
    )
}

export default Popup
