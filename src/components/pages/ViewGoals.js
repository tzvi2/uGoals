import React, {useState} from 'react'
import styles from '../../css/ViewGoals.module.css'
import GoalCard from '../GoalCard'
import {Link} from 'react-router-dom'
import { useGoalContext } from '../../context/GoalContext'
import { useAuthContext } from '../../context/AuthContext'
import { useEffect } from 'react'

function ViewGoals() {

    const {currentUsersGoals, setCurrentUsersGoals, getGoals} = useGoalContext()
    const {authUser} = useAuthContext()

    const retrieve = async () => {
        try {
            const goals = await getGoals(authUser.uid)
            setCurrentUsersGoals(goals)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (authUser !== null) {
            retrieve()
        }
    }, [authUser])

    return (
        <>
        <div className={styles.flexColumn}>
        {currentUsersGoals ? Object.keys(currentUsersGoals).map(key => (
            <GoalCard 
                title={currentUsersGoals[key].title}
                deadline={currentUsersGoals[key].deadline}
                complete={currentUsersGoals[key].complete}
                id={key}
                key={key}
            />
        )): <p>loading</p>}
            
            
        </div>

        <div className={styles.flexColumn}>
            <Link className={styles.button} to="/newgoal">New goal</Link>
        </div>
        </>
    )
}

export default ViewGoals
