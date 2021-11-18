import React, {useState, useEffect, useContext} from 'react'
import {db} from '../config/firebase'
import {setDoc, doc, getDoc} from 'firebase/firestore'

const GoalContext = React.createContext()

export const useGoalContext = () => useContext(GoalContext)

export function GoalProvider({children}) {

    const [currentGoal, setCurrentGoal] = useState()

    const value = {
        currentGoal
    }

    return (
        <GoalContext.Provider value={value}>
            {children}
        </GoalContext.Provider>
    )
}

export default GoalProvider
