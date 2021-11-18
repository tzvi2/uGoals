import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBe8EcLGZMlkW1DRQQb6W61AKtzEFE8oVc",
  authDomain: "goalsapp-beaf7.firebaseapp.com",
  databaseURL: "https://goalsapp-beaf7-default-rtdb.firebaseio.com",
  projectId: "goalsapp-beaf7",
  storageBucket: "goalsapp-beaf7.appspot.com",
  messagingSenderId: "543677480965",
  appId: "1:543677480965:web:d17a2b4ac2752e97ee9c6c"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)
export const auth = getAuth(app)