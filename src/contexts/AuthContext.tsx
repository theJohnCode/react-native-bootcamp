import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
    name: string;
    loggedIn: boolean;
}
interface AuthContextType {
    user: User | null;
    login: (username: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // Initialize user state from AsyncStorage on mount
    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);
                }
            } catch (error) {
                console.error('Error loading user from AsyncStorage:', error);
            }
        };
        
        loadUser();
    }, []);

    const login = async (username: string) => {
        try {
            // Store the user data in AsyncStorage
            await AsyncStorage.setItem('user', JSON.stringify({ name: username, loggedIn: true }));

            // Get the user data from AsyncStorage and set it to state
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const logout = () => {
        setUser(null);
        AsyncStorage.removeItem('user')
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
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
