import React, {useState} from 'react'
import styles from '../../css/ViewGoals.module.css'
import GoalCard from '../GoalCard'
import {Link, useParams} from 'react-router-dom'
import { useGoalContext } from '../../context/GoalContext'
import { useAuthContext } from '../../context/AuthContext'
import { useEffect } from 'react'

function ViewGoals() {

    let params = useParams()


    const {getGoals, findGoalWithTitle, currentUsersGoals} = useGoalContext()
    const {authUser} = useAuthContext()
    const [animationDelay, setAnimationDelay] = useState(0.5)

    useEffect(() => {
        console.log(currentUsersGoals)
    }, [])



    return (
       <>
        {currentUsersGoals && 
        <div className={styles.goalsSection}>
            {Object.entries(currentUsersGoals).map(([key, goal], i) => (
                <GoalCard 
                    goal={goal}
                    key={Math.random()}
                    id={key}
                />
            ))}
        </div>}
        
        
        {(currentUsersGoals === null || Object.keys(currentUsersGoals).length === 0) && 
        <div>
            <p>No goals to show.</p>
        </div>}
       </> 
    )
}

export default ViewGoals
