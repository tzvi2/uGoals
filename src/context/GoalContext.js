import React, {useState, useEffect, useContext} from 'react'
import {db} from '../config/firebase'
import {setDoc, doc, getDoc, updateDoc, serverTimestamp} from 'firebase/firestore'
import { useAuthContext } from './AuthContext'
import {getRandomID} from '../utils/ids'

const GoalContext = React.createContext()

export const useGoalContext = () => useContext(GoalContext)

export function GoalProvider({children}) {

    const {authUser} = useAuthContext()

    const [currentGoal, setCurrentGoal] = useState()
    const [currentGoalID, setCurrentGoalID] = useState('')
    const [currentUsersGoals, setCurrentUsersGoals] = useState({})

    const saveGoal = async (goal) => {
        let randID = getRandomID()
        const saved = await setDoc(doc(db, "goals", authUser.uid), {
            [`${randID}`]: goal
        }, {merge: true})
        return saved
    }

    const getGoals = async (id) =>  {
        const docRef = doc(db, "goals", id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            return docSnap.data()
        } else {
            console.log('error getting data')
            return {}
        }
    }

    useEffect(() => {
        console.log('currentUsersGoals', currentUsersGoals)
    }, [currentUsersGoals])

    const value = {
        currentGoal,
        setCurrentGoal,
        currentGoalID,
        setCurrentGoalID,
        currentUsersGoals,
        setCurrentUsersGoals,
        saveGoal,
        getGoals
    }

    return (
        <GoalContext.Provider value={value}>
            {children}
        </GoalContext.Provider>
    )
}

export default GoalProvider
