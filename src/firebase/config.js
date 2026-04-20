import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDDefTT0RdZEs6R1En_7NIGNhqoR2La20k",
  authDomain: "usratul-amine.firebaseapp.com",
  projectId: "usratul-amine",
  storageBucket: "usratul-amine.firebasestorage.app",
  messagingSenderId: "445894484480",
  appId: "1:445894484480:web:98b74d90963c75a0642ee5"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
