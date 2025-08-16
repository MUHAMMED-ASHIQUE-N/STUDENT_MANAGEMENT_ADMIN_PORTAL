import React, { createContext, useEffect, useState, type ReactNode } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import type { AuthContextType, UserData } from '../type/auth';


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    const login = async (email: string, password: string) => {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        
        const docsnap = await getDoc(doc(db, "users", cred.user.uid)); 
        if (docsnap.exists()) {
            setUser(docsnap.data() as UserData);
        }
        else{
            throw new Error("user data is note foundedddd");
        }
    }

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    }


    //keep loggedin
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const docsnap = await getDoc(doc(db, 'users', firebaseUser.uid));
                if (docsnap.exists()) {
                    setUser(docsnap.data() as UserData);
                }
                else {
                    setUser(null);
                }
                
            }
            setLoading(false);
        });

        return () => unsubscribe();

    }, [])



    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {/* {!loading && children} */}
              {loading ? <p>Loading...</p> : children}
        </AuthContext.Provider>
    )
}
