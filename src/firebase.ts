// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, DocumentData, CollectionReference } from "firebase/firestore"
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_APIKEY,
    authDomain: import.meta.env.VITE_AUTHDOMAIN,
    projectId: import.meta.env.VITE_PROJECTID,
    storageBucket: import.meta.env.VITE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_APPID,
    measurementId: import.meta.env.VITE_MEASUREMENTID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

//Firestore collection name
export const usersCollection = 'users'
export const shoppingListCollection = 'shopping_lists'
export const shoppingListUsersCollection = 'shopping_lists_users'

const createCollection = <T = DocumentData>(collectionName: string) => {
    return collection(db, collectionName) as CollectionReference<T>
}

//Firestore collection refs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const usersRef = createCollection<any>(usersCollection)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const shoppingListsRef = createCollection<any>(shoppingListCollection)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const shoppingListsUsersRef = createCollection<any>(shoppingListUsersCollection)
