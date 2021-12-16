import React, {useState, useEffect, useContext, useCallback} from 'react'
import {auth, db} from '../config/firebase'
import {setDoc, doc, collection, getDoc, getDocs, updateDoc, serverTimestamp, onSnapshot, increment, deleteField, query, orderBy} from 'firebase/firestore'
import { useAuthContext } from './AuthContext'
import {getRandomID} from '../utils/ids'
import { removeTrailingWhiteSpace } from '../utils/strings'
import { useNavigate } from 'react-router'
import {debounce} from 'lodash'
import { dateStringToUS, getDateStringsUntilDeadline } from '../utils/dates'

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
    const [actions, setActions] = useState({day: {}, week: {}, month: {}})
    let firstLoad = true

    const saveGoal = async (userId, goal) => {
        console.log('goal', goal)
        goal.title = removeTrailingWhiteSpace(goal.title)
        const newGoal = await setDoc(doc(db, "goals", userId), {
            [`${getRandomID()}`]: {...goal, createdAt: serverTimestamp()}
        }, {merge: true})
        const userRef = doc(db, "users", userId)
        await updateDoc(userRef, {
            goalsCreated: increment(1)
        })
        //saveActions()
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

    const getActions = async () => {
        const actionsRef = doc(db, "actions", authUser.uid)
        const actionsSnap = await getDoc(actionsRef)
        if (actionsSnap.exists()) {
            return actionsSnap.data()
        } else {
            return {}
        }
    }

    const getSortedActions = async () => {
        const actionsRef = collection(db, "actions", authUser.uid)
        const q = query(actionsRef, orderBy("createdAt"))
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
            console.log(doc.data())
        })
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

    const deleteGoal = async (goalId) => {
        console.log("attempting to delete goal with id: ", goalId)
        removeActions(goalId)
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

    const findGoalWithTitle = (title) => {
        for (let key of Object.keys(currentUsersGoals)) {
            if (currentUsersGoals[key].title === title) {
                console.log('found it!', currentUsersGoals[key])
                break
            }
        }
    }

    const saveActions = async () => {
        let obj = actions // { day:{}, week:{}, month:{}}
        console.log('currentUsersGoals', currentUsersGoals)
        for (let goal of Object.values(currentUsersGoals)) {
            console.log('goal', goal)
            for (let [key, data] of Object.entries(goal.actions)) {
                obj[goal.splitTime][key] = {
                    name: data.name,
                    createdAt: serverTimestamp()
                }
                for (let elem of getDateStringsUntilDeadline(goal.deadline, goal.splitTime)) {
                    obj[goal.splitTime][key][elem] = {
                        complete: false
                    }
                } 
            } 
        }
        const actionsRef = doc(db, "actions", authUser.uid)
        await updateDoc(actionsRef, obj)
    }



    const updateActions = async () => {
        // check if all actions in currUsersGoals
        // are in database data
        // if action is in currUsersGoals thats
        // not in database data
        // update newActions
        // send newActions to DB
        let dbActions = {}
        let newActions = actions
        let changed = false
        const actionsRef = doc(db, "actions", authUser.uid)
        const obj = await getDoc(actionsRef)
        if (obj.exists()) {
            dbActions = obj.data()
        }
        //console.log('dbActions', dbActions)
        Object.entries(currentUsersGoals).forEach(([goalID, goalData]) => {
            Object.entries(currentUsersGoals[goalID].actions).forEach(([actionID, actionData]) => {
                if (!dbActions[goalData.splitTime][actionID]) {
                    changed = true
                    newActions[goalData.splitTime][actionID] = {
                        name: actionData.name,
                        createdAt: actionData.createdAt
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

    const handleSetActions = async (allGoals) => {
        let newActions = actions
        const actionsRef = doc(db, "actions", authUser.uid)
        let oldActions = await getDoc(actionsRef)
        if (oldActions.exists()) {
            oldActions = oldActions.data()
        }
        let changed = false
        Object.entries(allGoals).forEach(([goalID, goalData]) => {
            Object.entries(allGoals[goalID].actions).forEach(([actionID, actionData]) => {
                if (!actions[goalData.splitTime][actionID]) {
                    changed = true
                    newActions[goalData.splitTime][actionID] = {
                        name: actionData.name,
                        createdAt: new Date().getTime()
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

    const removeAction = async (period, actionID) => {
        const actionsRef = doc(db, "actions", authUser.uid)
        await updateDoc(actionsRef, {
            [`${period}.${actionID}`]: deleteField()
        })
    }

    const removeActions = async (goalID) => {
        // delete all action keys in goal from
        // newActions, setDOc
        let newActions = actions
        for (let key of Object.keys(currentUsersGoals[goalID].actions)) {
            delete newActions[currentUsersGoals[goalID].splitTime][key]
        }
        const actionsRef = doc(db, "actions", authUser.uid)
        await updateDoc(actionsRef, newActions)
    }
    
    // const updateActions = async () => {
    //     let newActions = {}
    //     let oldActions = {}
    //     const actionsRef = doc(db, "actions", authUser.uid)
    //     const actionsSnap = await getDoc(actionsRef)
    //     if (actionsSnap.exists()) {
    //         oldActions = actionsSnap.data()
    //         newActions = actionsSnap.data()
    //     }
    //     for (let goalID of Object.keys(currentUsersGoals)) {
    //         for (let [actionID, data] of Object.entries(currentUsersGoals[goalID].actions)) {
    //             if (!newActions[currentUsersGoals[goalID].splitTime][actionID]) {
    //                 newActions[currentUsersGoals[goalID].splitTime][actionID] = {
    //                     name: data.name,
    //                     createdAt: serverTimestamp()
    //                 }
    //                 for (let elem of getDateStringsUntilDeadline(currentUsersGoals[goalID].deadline, currentUsersGoals[goalID].splitTime)) {
    //                     newActions[currentUsersGoals[goalID].splitTime][actionID][elem] = {
    //                         complete: false
    //                     }
    //                 }
    //             }
    //         }
    //         for (let key of Object.keys(newActions[currentUsersGoals[goalID].splitTime])) {
    //             if (!currentUsersGoals[goalID].actions[key]) {
    //                 await updateDoc(actionsRef, {
    //                     [`${currentUsersGoals[goalID].splitTime}.${key}`]: deleteField()
    //                 })
    //                 return 
    //             }
    //         }
    //     }
    //     console.log('new actions', newActions)
    //     //await updateDoc(actionsRef, newActions)
    // }

    useEffect(() => {
        console.log("actions", actions)
    }, [actions])
 
    useEffect(() => {
        //console.log('pendingGoalChange', pendingGoal)
        if (authUser && Object.keys(pendingGoal).length > 0) {
            savePendingGoal()
        }
    }, [pendingGoal])

    // useEffect(() => {
    //     if (authUser) {
    //         const unsubGoalChanges = onSnapshot(doc(db, "goals", authUser.uid), (doc) => {
    //             setCurrentUsersGoals(doc.data())
    //             handleSetActions(doc.data())
    //         })
    //         return () => {
    //             unsubGoalChanges()
    //         }
    //     }
    // }, [authUser])

    // useEffect(() => {
    //     if (authUser) {
    //         const unsubscribe = onSnapshot(doc(db, "actions", authUser.uid), (doc) => {
    //             console.log('actions DB change')
    //             setActions(doc.data())
    //         })
    //         return () => unsubscribe()
    //     }
    // }, [authUser])

    useEffect(() => {
        if (authUser) {
            const unsubGoalChanges = onSnapshot(doc(db, "goals", authUser.uid), (goals) => {
                setCurrentUsersGoals(goals.data())
            })
            const unsubActionChanges = onSnapshot(doc(db, "actions", authUser.uid), (actions) => {
                setActions(actions.data())
            })
            return () => {
                unsubGoalChanges()
                unsubActionChanges()
            }
        }
    }, [authUser])

    useEffect(() => {
        setUserGoalsLoading(true)
        if (currentUsersGoals) {
            setUserGoalsLoading(false)
        }
        if (currentUsersGoals && Object.keys(currentUsersGoals).length > 0 ) {
            setMostRecentKey(getMostRecentKey())
            //console.log('currentUserGoals not empty, updating DB actions')
            updateActions()
            //getSortedActions()
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
        actions,
        removeAction,
        toggleActionComplete,
        getSortedActions
    }

    return (
        <GoalContext.Provider value={value}>
            {children}
        </GoalContext.Provider>
    )
}

export default GoalProvider
