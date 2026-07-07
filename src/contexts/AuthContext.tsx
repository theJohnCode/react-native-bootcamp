import { createContext, useState, useContext, ReactNode } from 'react';

interface User {
    name: string;
    loggedIn: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (username: string) => void;
    logout: () => void;
    hasSeenLoginPrompt: boolean;
    skipLogin: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [hasSeenLoginPrompt, setHasSeenLoginPrompt] = useState(false);

    const login = (username: string) => {
        setUser({ name: username, loggedIn: true });
        setHasSeenLoginPrompt(true);
    };

    const logout = () => {
        setUser(null);
    };

    const skipLogin = () => {
        setHasSeenLoginPrompt(true);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, hasSeenLoginPrompt, skipLogin }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}