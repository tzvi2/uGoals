import React, {useState, useEffect, useContext} from 'react'
import {auth} from '../config/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from '@firebase/auth'

const AuthContext = React.createContext()

export const useAuthContext = () => useContext(AuthContext)

export function AuthProvider({children}) {

    const [currentUser, setCurrentUser] = useState(null)

    const value = {
        currentUser
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
