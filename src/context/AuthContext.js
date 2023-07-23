import React, {useState, useEffect, useContext} from 'react'
import {auth, db} from '../config/firebase'
import {addDoc, collection, setDoc, doc, getDoc, onSnapshot, deleteDoc} from 'firebase/firestore'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, deleteUser, reauthenticateWithCredential, reauthenticateWithPopup, EmailAuthCredential, AuthCredential, EmailAuthProvider} from '@firebase/auth'

const AuthContext = React.createContext()

export const useAuthContext = () => useContext(AuthContext)

export function AuthProvider({children}) {

    const [authUser, setAuthUser] = useState()
    const [authLoading, setAuthLoading] = useState(true)
    const [authStateLoading, setAuthStateLoading] = useState(true)
    const [userInfo, setUserInfo] = useState(null) 
    
    const signup = async (name, email, password) => {
        const newUser = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(auth.currentUser, {
            displayName: name
        })
        await setDoc(doc(db, "users", newUser.user.uid), {
            goalsCreated: 0,
            goalsCompleted: 0
        })
        await setDoc(doc(db, "actions", newUser.user.uid), {
            day: {},
            week: {},
            month: {}
        })
        return newUser
    }

    const signin = async (email, password) => {
        const user = await signInWithEmailAndPassword(auth, email, password)
        return user
    }

    const signout = async () => {
        return signOut(auth)
    }

    const deleteAccount = async (userID) => {
        // await deleteDoc(doc(db, "users", userID))
        // await deleteDoc(doc(db, "goals", userID))
        // await deleteDoc(doc(db, "actions", userID))
        await deleteUser(authUser)
    }

    const reAuthenticate = async (password) => {
        const cred = EmailAuthProvider.credential(
            authUser.email,
            password
        )
        const re = await reauthenticateWithCredential(authUser, cred)
        return re
    }

    useEffect(() => {
        const unsubAuthChanges = auth.onAuthStateChanged(user => {
            setAuthUser(user)
        })
        return () => unsubAuthChanges()
    }, [])

    useEffect(() => {
        if (authUser || authUser === null) {
            setAuthStateLoading(false)
        }
        if (authUser) {
            const unsubUserInfoChanges = onSnapshot(doc(db, "users", authUser.uid), (info) => {
                setUserInfo(info.data())
                setAuthStateLoading(false)
            })
            return () => unsubUserInfoChanges()
        }
    }, [authUser])

    const value = {
        authUser,
        signup,
        signin,
        signout,
        userInfo,
        setUserInfo,
        // getUserInfo,
        authLoading,
        deleteAccount,
        authStateLoading,
        reAuthenticate
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
