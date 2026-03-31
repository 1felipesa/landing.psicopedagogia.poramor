import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

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
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            mapSessionToUser(session);
            setIsLoading(false);
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setRecoveryMode(true);
            }
            mapSessionToUser(session);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const mapSessionToUser = async (session: Session | null) => {
        if (!session?.user) {
            setUser(null);
            return;
        }

        try {
            // Fetch profile data from Supabase DB
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            const email = session.user.email || '';
            const role = profile?.role === 'admin' ? UserRole.ADMIN : UserRole.PATIENT;

            setUser({
                id: session.user.id,
                name: profile?.full_name || email.split('@')[0],
                email: email,
                role: role,
                avatarUrl: profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name || email}&background=random`,
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            // Fallback
            setUser({
                id: session.user.id,
                name: session.user.email?.split('@')[0] || 'User',
                email: session.user.email || '',
                role: UserRole.PATIENT,
                avatarUrl: '',
            });
        }
    };

    const login = async (email: string, password?: string) => {
        if (!password) throw new Error("Senha é obrigatória.");
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
        } catch (error: any) {
            alert(`Erro de autenticação: ${error.message || 'Verifique seus dados.'}`);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (email: string, password: string, name: string) => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    }
                }
            });

            if (error) throw error;

            // Auto login happens usually, but let's alert success
            alert('Cadastro realizado com sucesso!');
        } catch (error: any) {
            alert(`Erro ao cadastrar: ${error.message}`);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
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
