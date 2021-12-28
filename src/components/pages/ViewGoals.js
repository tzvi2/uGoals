import React, {useState} from 'react'
import styles from '../../css/ViewGoals.module.css'
import GoalCard from '../GoalCard'
import { useGoalContext } from '../../context/GoalContext'
import { useAuthContext } from '../../context/AuthContext'
import { useEffect } from 'react'

function ViewGoals() {

    const {currentUsersGoals, userGoalsLoading} = useGoalContext()
    const [animationDelay, setAnimationDelay] = useState(0.5)

    const [sortedGoals, setSortedGoals] = useState([])

    const handleSortGoals = () => {
        let completed = []
        let inProgress = []
        for (let [key, value] of Object.entries(currentUsersGoals)) {
            if (currentUsersGoals[key].complete) {
                completed.push({id: key, ...value})
            } else {
                inProgress.push({id: key, ...value})
            }
        }
       
        setSortedGoals([...sortByCreationTime(inProgress), ...sortByCreationTime(completed)])
    }

    const sortByCreationTime = (arr) => {
        for (let i = 1; i < arr.length; i++) {
            let p = i
            while (p > 0 && arr[p].createdAt < arr[p - 1].createdAt) {
                let temp = arr[p - 1]
                arr[p - 1] = arr[p]
                arr[p] = temp
                p--
            }
        }
        return arr
    }

    useEffect(() => {
        console.log(currentUsersGoals)
        if (currentUsersGoals && Object.keys(currentUsersGoals).length > 0) {
            handleSortGoals()
        }
    }, [currentUsersGoals])

    return (
       <>
        {sortedGoals.length > 0 && 
        <div className={styles.goalsSection}>
            {sortedGoals.map((goal, i) => (
                <GoalCard 
                    goal={goal}
                    index={i}
                    key={Math.random()}
                    id={goal.id}
                />
            ))}
        </div>}
        
        
        {!userGoalsLoading && Object.keys(currentUsersGoals).length === 0 &&
        <div className={styles.message}>
            <p>No goals to show.</p>
        </div>}
       </> 
    )
}

export default ViewGoals
