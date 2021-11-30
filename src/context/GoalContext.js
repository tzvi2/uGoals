import React, {useState, useEffect, useContext} from 'react'
import {auth, db} from '../config/firebase'
import {setDoc, doc, getDoc, updateDoc, serverTimestamp, onSnapshot, increment} from 'firebase/firestore'
import { useAuthContext } from './AuthContext'
import {getRandomID} from '../utils/ids'
import { removeTrailingWhiteSpace } from '../utils/strings'
import { useNavigate } from 'react-router'

const GoalContext = React.createContext()

export const useGoalContext = () => useContext(GoalContext)

export function GoalProvider({children}) {

    const {authUser} = useAuthContext()

    const [currentUsersGoals, setCurrentUsersGoals] = useState({})
    const [currentTitle, setCurrentTitle] = useState("")
    const [currentSummary, setCurrentSummary] = useState("")
    const [currentDeadline, setCurrentDeadline] = useState()
    const [mostRecentKey, setMostRecentKey] = useState()
    const [currentGoal, setCurrentGoal] = useState()
    

    const saveGoal = async (goal, title) => {
        title = removeTrailingWhiteSpace(title)
        console.log('saving goal', goal)
        await setDoc(doc(db, "goals", authUser.uid), {
            [`${title}`]: {...goal, createdAt: serverTimestamp()}
        }, {merge: true})
        setCurrentTitle(title)
        const userRef = doc(db, "users", authUser.uid)
        await updateDoc(userRef, {
            goalsCreated: increment(1)
        })

    }

    const getGoals = async (userId) => {
        const docRef = doc(db, "goals", userId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            return docSnap.data()
        } else {
            console.log('error getting data')
            return {}
        }
    }

    const getGoal = async (userId, goalId) => {
        const docRef = doc(db, "goals", userId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            return docSnap.data()[goalId]
        }
    }

    const toggleGoalComplete = async (userId, goalId, complete) => {
        console.log(goalId, complete)
        const docRef = doc(db, "goals", userId)
        const userRef = doc(db, "users", userId)
        await updateDoc(docRef, {
            [`${goalId}.complete`] : !complete
        })
        await updateDoc(userRef, {
            goalsCompleted: increment(`${complete ? -1 : 1}`)
        })
    }

    const updateGoalSummary = async (goalId, newSummary) => {
        const docRef = doc(db, "goals", authUser.uid)
        await updateDoc(docRef, {
            [`${goalId}.summary`] : newSummary
        })
    }

    const getMostRecentKey = (userId) => {
        let mostRecent = 0
        let mostRecentKey = ""
        for (let key of Object.keys(currentUsersGoals)) {
            if (currentUsersGoals && currentUsersGoals[key]["createdAt"] && currentUsersGoals[key]["createdAt"]["seconds"] > mostRecent) {
                mostRecent = currentUsersGoals[key]["createdAt"]["seconds"]
                mostRecentKey = key
            }  
        }
        return mostRecentKey
    }

    const getGoalSummary = async (goalId) => {
        const docRef = doc(db, "goals", authUser.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            return docSnap.data().summary
        } else {
            console.log('error getting summary.')
        }
    }
    
    
    useEffect(() => {
        if (authUser) {
            const unsubGoalChanges = onSnapshot(doc(db, "goals", authUser.uid), (doc) => {
                setCurrentUsersGoals(doc.data())
            })
            return unsubGoalChanges
        }
    }, [authUser])

    useEffect(() => {
        if (currentUsersGoals && Object.keys(currentUsersGoals).length > 0 ) {
            setMostRecentKey(getMostRecentKey())
            console.log('currentUsersGOals', currentUsersGoals)
        }
    }, [currentUsersGoals])

    useEffect(() => {
        //console.log('currentTitle in goalContext', currentTitle)
        if (currentUsersGoals && Object.keys(currentUsersGoals).length > 0 && currentTitle) {
            setCurrentGoal(currentUsersGoals[currentTitle])
        }
        
    }, [currentTitle])

    // useEffect(() => {
    //     console.log('mostRecentKey', mostRecentKey)
    // }, [mostRecentKey])

    const value = {
        currentUsersGoals,
        setCurrentUsersGoals,
        saveGoal,
        getGoals,
        toggleGoalComplete,
        updateGoalSummary,
        getGoal,
        setCurrentTitle,
        currentTitle,
        mostRecentKey,
        setMostRecentKey,
        getMostRecentKey,
        getGoalSummary,
        currentSummary,
        setCurrentSummary,
        currentDeadline, 
        setCurrentDeadline,
        currentGoal,
        setCurrentGoal
    }

    return (
        <GoalContext.Provider value={value}>
            {children}
        </GoalContext.Provider>
    )
}

export default GoalProvider
