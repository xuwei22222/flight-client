import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/AxiosApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await api.get('/auth/check', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.data.loggedIn) {
                    setUser(JSON.parse(localStorage.getItem('user')));
                }
            } catch (error) {
                logout();
            }
            setLoading(false);
        };
        
        if (localStorage.getItem('token')) {
            verifyToken();
        }
    }, []);

    const login = (token, userInfo) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userInfo));
        setUser(userInfo);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
