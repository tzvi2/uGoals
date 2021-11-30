import React, {useState} from 'react'
import styles from '../../css/ViewGoals.module.css'
import GoalCard from '../GoalCard'
import {Link, useParams} from 'react-router-dom'
import { useGoalContext } from '../../context/GoalContext'
import { useAuthContext } from '../../context/AuthContext'
import { useEffect } from 'react'

function ViewGoals() {

    let params = useParams()


    const {getGoals} = useGoalContext()
    const {authUser} = useAuthContext()
    const [currentUsersGoals, setCurrentUsersGoals] = useState(null)
    const [animationDelay, setAnimationDelay] = useState(0.5)

    const retrieve = async () => {
        try {
            const goals = await getGoals(authUser.uid)
            setCurrentUsersGoals(goals)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (authUser) {
            retrieve()
        }
    }, [authUser])

    return (
       <>
        {currentUsersGoals && 
        <div className={styles.goalsSection}>
            {Object.keys(currentUsersGoals).map((key, i) => (
                <GoalCard 
                    title={key}
                    deadline={currentUsersGoals[key].deadline}
                    complete={currentUsersGoals[key].complete}
                    id={key}
                    key={Math.random()}
                    index={i}
                />
               
            ))}
        </div>}
       </> 
    )
}

export default ViewGoals
