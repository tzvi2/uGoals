import React, {useState, useEffect, useContext, useCallback} from 'react'
import {auth, db} from '../config/firebase'
import {setDoc, doc, getDoc, updateDoc, serverTimestamp, onSnapshot, increment, deleteField} from 'firebase/firestore'
import { useAuthContext } from './AuthContext'
import {getRandomID} from '../utils/ids'
import { removeTrailingWhiteSpace } from '../utils/strings'
import { useNavigate } from 'react-router'
import {debounce} from 'lodash'
import { getDaysBetween } from '../utils/dates'

const GoalContext = React.createContext()

export const useGoalContext = () => useContext(GoalContext)

export function GoalProvider({children}) {

    const {authUser, userInfo} = useAuthContext()

    const [currentUsersGoals, setCurrentUsersGoals] = useState({})
    const [currentGoalId, setCurrentGoalId] = useState("")
    const [currentTitle, setCurrentTitle] = useState("")
    const [currentSummary, setCurrentSummary] = useState("")
    const [currentDeadline, setCurrentDeadline] = useState()
    const [mostRecentKey, setMostRecentKey] = useState("")
    const [currentGoal, setCurrentGoal] = useState({})
    const [pendingGoal, setPendingGoal] = useState({})
    const [secondsRemaining, setSecondsRemaining] = useState(0)
    const [userGoalsLoading, setUserGoalsLoading] = useState(false)
    const [hasPendingGoal, setHasPendingGoal] = useState(false)
    const [actionsShelMata, setActionsShelMata] = useState({})

    const [dueActions, setDueActions] = useState({day: {}, week: {}, month: {}})

    const saveGoal = async (userId, goal) => {
        goal.title = removeTrailingWhiteSpace(goal.title)
        console.log('saving goal', goal)
        await setDoc(doc(db, "goals", userId), {
            [`${getRandomID()}`]: {...goal, createdAt: serverTimestamp()}
        }, {merge: true})
        const userRef = doc(db, "users", userId)
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
        //console.log(goalId, complete)
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

 

    const userHasGoals = () => {
        return (Object.keys(currentUsersGoals).length > 0)
    }

    const deleteGoal = async (goalId) => {
        console.log("attempting to delete goal with id: ", goalId)
        const goalRef = doc(db, "goals", authUser.uid)
        await updateDoc(goalRef, {
            [`${goalId}`]: deleteField()
        })
        const userRef = doc(db, "users", authUser.uid)
        await updateDoc(userRef, {
            goalsCreated: increment(-1),
            goalsCompleted: increment(-1)
        })
    }
    
    const savePendingGoal = async () => {
        console.log('updating pendign')
        const usersGoals = doc(db, "goals", authUser.uid)
        await updateDoc(usersGoals, {
            [`${currentGoalId}`]: pendingGoal
        })
    }
    


    useEffect(() => {
        //console.log('due actions', dueActions)
        //updateDBActions()
    }, [dueActions])
 
    useEffect(() => {
        console.log('pendingGoalChange', pendingGoal)
        if (authUser && Object.keys(pendingGoal).length > 0) {
            savePendingGoal()
        }
    }, [pendingGoal])

    useEffect(() => {
        if (authUser) {
            const unsubGoalChanges = onSnapshot(doc(db, "goals", authUser.uid), (doc) => {
                setCurrentUsersGoals(doc.data())
            })
            return () => unsubGoalChanges()
        }
    }, [authUser])

    const updateDueActions = () => {
        for (let goal of Object.values(currentUsersGoals)) {
            let obj = {}
            for (let [key, data] of Object.entries(goal.actions)) {
                //if (goal.splitTime === "day") {
                    obj = dueActions[goal.splitTime]
                    obj[key] = {
                        name: data.name,
                    }
                    for (let elem of getDateStringsUntilDeadline(goal.deadline, goal.splitTime)) {
                        obj[key][elem] = {
                            complete: false
                        }
                    } 
                //}
            }
            setDueActions({...dueActions, [goal.splitTime]: obj})
        }
    }

    const getDateStringsUntilDeadline = (date, period) => {
        date = new Date(date)
        let results = []
        let today = new Date()
        if (period === "day") {
            for (let i = 0; i < getDaysBetween(today, date); i++) {
                let tomorrow = new Date(today)
                tomorrow.setDate(tomorrow.getDate() + i)
                results.push(tomorrow.toDateString())
            }
        } else if (period === "week") {
            while (today.getTime() < date.getTime()) {
                results.push(today.toDateString())
                today.setDate(today.getDate() + 7)
            }
        } else {
            // add case for feb
            while (today.getTime() < date.getTime()) {
                results.push(today.toDateString())
                today.setDate(today.getMonth() + 1)
            }
        }
        return results
    }

    useEffect(() => {
        setUserGoalsLoading(true)
        if (currentUsersGoals) {
            setUserGoalsLoading(false)
        }
        if (currentUsersGoals && Object.keys(currentUsersGoals).length > 0 ) {
            console.log('currentUsersGoals', currentUsersGoals)
            setMostRecentKey(getMostRecentKey())
            //setPendingGoal(currentUsersGoals[currentTitle])
            updateDueActions()
            //getDateStringsUntilDeadline(new Date("2022-02-03"), "week")
        }
    }, [currentUsersGoals])

    useEffect(() => {
        //console.log('currentTitle in goalContext', currentTitle)
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

    

    useEffect(() => {
        //console.log('mostRecentKey', mostRecentKey)
    }, [mostRecentKey])

    const findGoalWithTitle = (title) => {
        //console.log('findingGoalWithTitle:', title)
        for (let key of Object.keys(currentUsersGoals)) {
            if (currentUsersGoals[key].title === title) {
                console.log('found it!', currentUsersGoals[key])
                break
            }
        }
    }

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
        findGoalWithTitle,
        hasPendingGoal,
        setHasPendingGoal,
        userHasGoals,
        userGoalsLoading,
        dueActions
    }

    return (
        <GoalContext.Provider value={value}>
            {children}
        </GoalContext.Provider>
    )
}

export default GoalProvider
