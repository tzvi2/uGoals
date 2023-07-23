import React, {useState, useEffect, useContext, useCallback} from 'react'
import {auth, db} from '../config/firebase'
import {setDoc, doc, collection, getDoc, getDocs, updateDoc, serverTimestamp, onSnapshot, increment, deleteField, query, orderBy} from 'firebase/firestore'
import { useAuthContext } from './AuthContext'
import {getRandomID} from '../utils/ids'
import { removeTrailingWhiteSpace } from '../utils/strings'
import { getDateStringsUntilDeadline } from '../utils/dates'

const GoalContext = React.createContext()

export const useGoalContext = () => useContext(GoalContext)

export function GoalProvider({children}) {

    const {authUser, userInfo} = useAuthContext()

    const [currentUsersGoals, setCurrentUsersGoals] = useState(null)
    const [currentGoalId, setCurrentGoalId] = useState("")
    const [currentTitle, setCurrentTitle] = useState("")
    const [currentSummary, setCurrentSummary] = useState("")
    const [currentDeadline, setCurrentDeadline] = useState()
    const [mostRecentKey, setMostRecentKey] = useState("")
    const [currentGoal, setCurrentGoal] = useState({})
    const [pendingGoal, setPendingGoal] = useState({})
    const [secondsRemaining, setSecondsRemaining] = useState(0)
    const [userGoalsLoading, setUserGoalsLoading] = useState(true)
    const [hasPendingGoal, setHasPendingGoal] = useState(false)
    const [actions, setActions] = useState({day: {}, week: {}, month: {}})
    const [justOpenedGoal, setJustOpenedGoal] = useState(true)

    const saveGoal = async (userId, goal) => {
        goal.title = removeTrailingWhiteSpace(goal.title)
        const newGoal = await setDoc(doc(db, "goals", userId), {
            [`${getRandomID()}`]: {...goal, createdAt: serverTimestamp()}
        }, {merge: true})
        const userRef = doc(db, "users", userId)
        await updateDoc(userRef, {
            goalsCreated: increment(1)
        })
        return newGoal
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
        const docRef = doc(db, "goals", userId)
        const userRef = doc(db, "users", userId)
        await updateDoc(docRef, {
            [`${goalId}.complete`] : !complete
        })
        await updateDoc(userRef, {
            goalsCompleted: increment(`${complete ? -1 : 1}`)
        })
    }

    const toggleActionComplete = async (period, actionid, dateStr, complete) => {
        const actionsRef = doc(db, "actions", authUser.uid)
        let updateObj = {}
        updateObj[`${period}.${actionid}.${dateStr}.complete`] = !complete
        await updateDoc(actionsRef, updateObj)
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

    const userHasGoals = () => {
        return (Object.keys(currentUsersGoals).length > 0)
    }

    const deleteGoal = async (goalId, complete) => {
        removeActions(goalId)
        const goalRef = doc(db, "goals", authUser.uid)
        await updateDoc(goalRef, {
            [`${goalId}`]: deleteField()
        })
        const userRef = doc(db, "users", authUser.uid)
        if (complete) {
            await updateDoc(userRef, {
                goalsCreated: increment(-1),
                goalsCompleted: increment(-1)
            })
        } else {
            await updateDoc(userRef, {
                goalsCreated: increment(-1),
            })
        }
    }
    
    const savePendingGoal = async () => {
        const usersGoals = doc(db, "goals", authUser.uid)
        await updateDoc(usersGoals, {
            [`${currentGoalId}`]: pendingGoal
        })
    }

    // const findGoalWithTitle = (title) => {
    //     for (let key of Object.keys(currentUsersGoals)) {
    //         if (currentUsersGoals[key].title === title) {
    //             break
    //         }
    //     }
    // }

    const updateActions = async () => {
        let dbActions = {}
        let newActions = actions
        let changed = false
        const actionsRef = doc(db, "actions", authUser.uid)
        const obj = await getDoc(actionsRef)
        if (obj.exists()) {
            dbActions = obj.data()
        }
        Object.entries(currentUsersGoals).forEach(([goalID, goalData]) => {
            Object.entries(currentUsersGoals[goalID].actions).forEach(([actionID, actionData]) => {
                if (!dbActions[goalData.splitTime][actionID]) {
                    changed = true
                    newActions[goalData.splitTime][actionID] = {
                        name: actionData.name,
                        createdAt: actionData.createdAt,
                        goal: goalID
                    }
                    for (let date of getDateStringsUntilDeadline(goalData.deadline, goalData.splitTime)) {
                        newActions[goalData.splitTime][actionID][date] = {
                            complete: false
                        }
                    }
                }
            })
        })
        if (changed) {
            const actionsRef = doc(db, "actions", authUser.uid)
            await setDoc(actionsRef, newActions)
        }
        
    }

    const handleSetActions = (obj) => {
        if (!obj) return 
        let newActions = {}
        newActions.day = obj.day
        newActions.week = obj.week
        newActions.month = obj.month
        setActions(newActions)
    }

    const removeAction = async (period, actionID) => {
        const actionsRef = doc(db, "actions", authUser.uid)
        await updateDoc(actionsRef, {
            [`${period}.${actionID}`]: deleteField()
        })
    }

    const removeActions = async (goalID) => {
        let newActions = actions
        for (let key of Object.keys(currentUsersGoals[goalID].actions)) {
            delete newActions[currentUsersGoals[goalID].splitTime][key]
        }
        const actionsRef = doc(db, "actions", authUser.uid)
        await updateDoc(actionsRef, newActions)
    }
 
    useEffect(() => {
        if (authUser && Object.keys(pendingGoal).length > 0 && !justOpenedGoal) {
            savePendingGoal()
        }
    }, [pendingGoal])

    useEffect(() => {
        if (authUser) {
            const unsubGoalChanges = onSnapshot(doc(db, "goals", authUser.uid), (goals) => {
                if (goals.data()) {
                    setCurrentUsersGoals(goals.data())
                }
            })
            const unsubActionChanges = onSnapshot(doc(db, "actions", authUser.uid), (actions) => {
                handleSetActions(actions.data())
            })
            return () => {
                unsubGoalChanges()
                unsubActionChanges()
            }
        }
    }, [authUser])

    useEffect(() => {
        console.log('currentUsersGoals', currentUsersGoals)
        if (currentUsersGoals) {
            setUserGoalsLoading(false)
        }
        if (currentUsersGoals && Object.keys(currentUsersGoals).length > 0 ) {
            setMostRecentKey(getMostRecentKey())
            updateActions()
        }
    }, [currentUsersGoals])

    useEffect(() => {
        if (currentGoal && Object.keys(currentGoal).length > 0) {
            setPendingGoal(currentGoal)
        }
        
    }, [currentGoal])

    useEffect(() => {
        if (secondsRemaining > 0) {
            const seconds = setTimeout(() => {
                setSecondsRemaining(secondsRemaining - 1)
            }, 1000)
            return () => clearTimeout(seconds)
        }
    }, [secondsRemaining])

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
        setCurrentGoal,
        pendingGoal,
        setPendingGoal,
        secondsRemaining,
        setSecondsRemaining,
        deleteGoal,
        currentGoalId, 
        setCurrentGoalId,
        hasPendingGoal,
        setHasPendingGoal,
        userHasGoals,
        userGoalsLoading,
        actions,
        removeAction,
        toggleActionComplete,
        justOpenedGoal,
        setJustOpenedGoal
    }

    return (
        <GoalContext.Provider value={value}>
            {children}
        </GoalContext.Provider>
    )
}

export default GoalProvider
