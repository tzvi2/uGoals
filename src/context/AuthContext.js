import React, {useState, useEffect, useContext} from 'react'
import {auth, db} from '../config/firebase'
import {addDoc, collection, setDoc, doc, getDoc} from 'firebase/firestore'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from '@firebase/auth'

const AuthContext = React.createContext()

export const useAuthContext = () => useContext(AuthContext)

// auth user to ref id (for getting and setting goals), displayname, and creation date
// goals user for goal completion

export function AuthProvider({children}) {

    const [authUser, setAuthUser] = useState(null)
    //const [currentUsersGoals, setCurrentUsersGoals] = useState({})
    //const [goalsUser, setGoalsUser] = useState(null)

    const signup = async (name, email, password) => {
        const newUser = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(auth.currentUser, {
            displayName: name
        })
        await setDoc(doc(db, "users", newUser.user.uid), {
            goalsCreated: 0,
            goalsCompleted: 0
        })
        

    }

    const signin = async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password)
    }

    const signout = async () => {
        return signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setAuthUser(user)
        })
        return unsubscribe
    }, [])

    useEffect(() => {
        console.log('authUser', authUser)
    }, [authUser])

    const value = {
        authUser,
        signup,
        signin,
        signout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
