import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInWithRedirect, 
    signInWithPopup, 
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
    NextOrObserver
}  from 'firebase/auth'

import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    collection,
    writeBatch,
    query,
    getDocs,
    QueryDocumentSnapshot
} from 'firebase/firestore'


import { Category } from '../../store/categories/category.types';


const firebaseConfig = {
    apiKey: "AIzaSyAovdv3UVnaemCg7cgcLeLbJoGyr6hW71k",
    authDomain: "kings-clothing-db-4d450.firebaseapp.com",
    projectId: "kings-clothing-db-4d450",
    storageBucket: "kings-clothing-db-4d450.appspot.com",
    messagingSenderId: "37748773130",
    appId: "1:37748773130:web:0addbdc599858febe82af3"
  };
  
  // Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
    prompt: "select_account"
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

export type ObjectToAdd = {
    title: string;
}

// method to upload categories from SHOP_DATA into the respective collections in firestore 
export const addCollectionAndDocuments = async <T extends ObjectToAdd> (
    collectionKey: string, 
    objectsToAdd: T[] 
    ): Promise<void> => {
        const collectionRef = collection(db, collectionKey );

        //use batch to add all objects to collectionRef in one transaction 
        const batch = writeBatch(db);
        objectsToAdd.forEach((object) => {
            // get document reference 
            const docRef = doc(collectionRef, object.title.toLowerCase());
            batch.set(docRef, object)
    });

    await batch.commit();
    console.log('done');
};



export const getCategoriesAndDocuments = async (): Promise<Category[]> => {
    const collectionRef = collection(db, 'categories');
    // generate a query of collection ref to get object snapshot
    const q = query(collectionRef);

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnapshot) => docSnapshot.data() as Category);
};

export type AdditionalInformation = {
    displayName?: string;
}

export type UserData = {
    createAt: Date;
    displayName: string;
    email: string;
}

export const createUserDocumentFromAuth = async ( 
    userAuth:User, 
    addtionalInformation = {} as AdditionalInformation 
): Promise<void | QueryDocumentSnapshot<UserData>> => {
    if (!userAuth) return;

   const userDocRef = doc(db, 'users', userAuth.uid );

    const userSnapshot = await getDoc(userDocRef);
    
    // if the user does not exists
    if(!userSnapshot.exists()) {
        // Create and set the document 
        const { displayName, email } = userAuth;
        const createdAt = new Date();

        try {
            await setDoc(userDocRef, {
                displayName,
                email,
                createdAt,
                ...addtionalInformation
            });
        } catch(error) {
            console.log('error created the user', error);
        }
    };

    return userSnapshot as QueryDocumentSnapshot<UserData>; 
};

export const createAuthUserWithEmailAndPassword = async (email: string, password: string) => {
    if (!email || !password) return;

    return await createUserWithEmailAndPassword(auth, email, password)
};

export const signInAuthUserWithEmailAndPassword = async (email:string, password:string) => {
    if (!email || !password) return;

    return await signInWithEmailAndPassword(auth, email, password)
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListner = (callback: NextOrObserver<User>) => 
onAuthStateChanged(auth , callback );

export const getCurrentUser = (): Promise<User | null> => {
    return new Promise((resolve,reject) => {
        const unsubscribe = onAuthStateChanged(
            auth,
            (userAuth) => {
                unsubscribe();
                resolve(userAuth);
            },
            reject
        );
    });
};


