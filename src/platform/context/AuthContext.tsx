import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { auth, db } from '../lib/firebase';
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password?: string) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
    recoveryMode: boolean;
    setRecoveryMode: (mode: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [recoveryMode, setRecoveryMode] = useState(false);

    useEffect(() => {
        // Detect recovery mode from URL if oobCode is present (Firebase password reset link)
        const params = new URLSearchParams(window.location.search);
        if (params.get('oobCode')) {
            setRecoveryMode(true);
        }

        // Listen for changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                await fetchAndSetUser(firebaseUser.uid, firebaseUser.email || '');
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const fetchAndSetUser = async (uid: string, email: string) => {
        try {
            // Fetch profile data from Firestore
            const profileRef = doc(db, 'profiles', uid);
            const profileSnap = await getDoc(profileRef);
            
            if (profileSnap.exists()) {
                const profile = profileSnap.data();
                const role = profile.role === 'admin' ? UserRole.ADMIN : UserRole.PATIENT;

                setUser({
                    id: uid,
                    name: profile.full_name || email.split('@')[0],
                    email: email,
                    role: role,
                    avatarUrl: profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.full_name || email}&background=random`,
                });
            } else {
                // Fallback if profile document doesn't exist yet
                setUser({
                    id: uid,
                    name: email.split('@')[0],
                    email: email,
                    role: UserRole.PATIENT,
                    avatarUrl: `https://ui-avatars.com/api/?name=${email}&background=random`,
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setUser({
                id: uid,
                name: email.split('@')[0],
                email: email,
                role: UserRole.PATIENT,
                avatarUrl: '',
            });
        }
    };

    const login = async (email: string, password?: string) => {
        if (!password) throw new Error("Senha é obrigatória.");
        setIsLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            let msg = 'Verifique seus dados.';
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                msg = 'E-mail ou senha incorretos.';
            } else if (error.code === 'auth/invalid-credential') {
                msg = 'Credenciais inválidas ou incorretas.';
            } else if (error.code === 'auth/invalid-email') {
                msg = 'E-mail inválido.';
            }
            alert(`Erro de autenticação: ${msg}`);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (email: string, password: string, name: string) => {
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Create profile document in Firestore profiles collection
            const profileRef = doc(db, 'profiles', firebaseUser.uid);
            await setDoc(profileRef, {
                full_name: name,
                email: email,
                role: 'patient', // default role
                avatar_url: `https://ui-avatars.com/api/?name=${name}&background=random`,
                created_at: new Date().toISOString()
            });

            alert('Cadastro realizado com sucesso!');
        } catch (error: any) {
            let msg = error.message;
            if (error.code === 'auth/email-already-in-use') {
                msg = 'Este e-mail já está em uso.';
            } else if (error.code === 'auth/weak-password') {
                msg = 'A senha precisa ter pelo menos 6 caracteres.';
            }
            alert(`Erro ao cadastrar: ${msg}`);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signUp, logout, isLoading, recoveryMode, setRecoveryMode }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

