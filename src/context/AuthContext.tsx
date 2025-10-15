import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
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

        const docsnap = await getDoc(doc(db, "userDetails", cred.user.uid));
        if (docsnap.exists()) {
            setUser(docsnap.data() as UserData);
        }
        else {
            throw new Error("user data is note foundedddd");
        }
    }

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const docsnap = await getDoc(doc(db, 'userDetails', firebaseUser.uid));
                if (docsnap.exists()) {
                    setUser(docsnap.data() as UserData);
                }
                else {
                    setUser(null);
                }

            }
            else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();

    }, [])

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {loading ? <Spinner /> : children}
        </AuthContext.Provider>
    )
}

export const Spinner = () => (
    <div className="w-full h-screen flex justify-center items-center ">
        <div className="w-18 h-18 border-6 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("AuthContext not found");
    return context;
};
