import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { isSupported, getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyDDefTT0RdZEs6R1En_7NIGNhqoR2La20k",
  authDomain: "usratul-amine.firebaseapp.com",
  projectId: "usratul-amine",
  storageBucket: "usratul-amine.firebasestorage.app",
  messagingSenderId: "445894484480",
  appId: "1:445894484480:web:98b74d90963c75a0642ee5",
  measurementId: "G-EQ0XKT3JJG"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export let analytics = null
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app)
  }
})

export default app
