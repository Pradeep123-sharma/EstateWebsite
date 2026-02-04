import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';
import api from '@/api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const checkAuth = async () => {
            try {
                const response = await api.get('/users/current-user');
                if (response.data.success) {
                    setUser(response.data.data);
                }
            } catch (error) {
                // User not logged in or token expired
                console.log("Not authenticated");
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/users/login', {
                email,
                password
            });

            if (response.data.success) {
                setUser(response.data.data.user);
                toast.success("Welcome back!");
                return true;
            }
        } catch (error) {
            const message = error.response?.data?.message || "Invalid credentials";
            toast.error(message);
            return false;
        }
    };

    const signup = async (formData) => {
        try {
            const response = await api.post('/users/register', formData);

            if (response.data.success) {
                // Auto login after signup
                const loginSuccess = await login(formData.get('email'), formData.get('password'));
                if (loginSuccess) {
                    toast.success("Account created successfully!");
                    return true;
                }
            }
        } catch (error) {
            const message = error.response?.data?.message || "Failed to create account";
            toast.error(message);
            return false;
        }
    };

    const logout = async () => {
        try {
            await api.post('/users/logout');
            setUser(null);
            toast.success("Logged out successfully");
        } catch (error) {
            // Even if API call fails, clear local state
            setUser(null);
            toast.success("Logged out successfully");
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
