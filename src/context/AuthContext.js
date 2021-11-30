import React, {useState, useEffect, useContext} from 'react'
import {auth, db} from '../config/firebase'
import {addDoc, collection, setDoc, doc, getDoc, onSnapshot} from 'firebase/firestore'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, deleteUser } from '@firebase/auth'

const AuthContext = React.createContext()

export const useAuthContext = () => useContext(AuthContext)

export function AuthProvider({children}) {

    const [authUser, setAuthUser] = useState()
    const [authLoading, setAuthLoading] = useState(true)
    const [userInfo, setUserInfo] = useState(null) // userInfo is {goalsCreated: x, etc.}
 
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

    const getUserInfo = async (id) => {
        console.log('id', id)
        const docRef = doc(db, "users", id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            return docSnap.data()
        } else {
            console.log('error getting user info')
            return {}
        }
    }

    const signin = async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password)
    }

    const signout = async () => {
        return signOut(auth)
    }

    const deleteAccount = async () => {
        console.log('deleting')
        return deleteUser(auth)
    }

    useEffect(() => {
        const unsubAuthChanges = auth.onAuthStateChanged(user => {
            setAuthUser(user)
        })
        return unsubAuthChanges
    }, [])

    useEffect(() => {
        if (authUser || authUser === null) {
            setAuthLoading(false)
        }
        if (authUser) {
            const unsubUserInfoChanges = onSnapshot(doc(db, "users", authUser.uid), (info) => {
                setUserInfo(info.data())
            })
            return unsubUserInfoChanges
        }
        
    }, [authUser])

    const value = {
        authUser,
        signup,
        signin,
        signout,
        userInfo,
        setUserInfo,
        getUserInfo,
        authLoading,
        deleteAccount
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
