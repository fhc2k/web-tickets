import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [data, setData] = useState({
        user: null,
        error: null,
        isLoading: false,
    });

    const getMe = async () => {
        try {
            const res = await fetch(`${API_URL}/auth/me`, {
                method: "GET",
                credentials: "include",
            });

            const { message, user } = await res.json();

            if (!res.ok) throw new Error(message);

            setData({ user: user, error: false, isLoading: false });
        } catch (error) {
            setData({ user: null, error, isLoading: false });
        }
    };

    const login = async (payload) => {
        try {
            const res = await fetch(`${API_URL}/auth/`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const { message, user } = await res.json();

            if (!res.ok) throw new Error(message);

            setData({ user, error: null, isLoading: false });
            toast.success(message);
        } catch (error) {
            setData({ user: null, error, isLoading: false });
            toast.error(error.message);
        }
    };

    const logout = async () => {
        try {
            const res = await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });

            const { message } = await res.json();
            if (!res.ok) throw new Error(message);

            setData({ user: null, error: null, isLoading: false });
            toast.success(message);
        } catch (error) {
            setData({ user: null, error, isLoading: false });
            toast.error(error.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setData((prev) => {
                return { ...prev, isLoading: true };
            });

            await getMe();

            setData((prev) => {
                return { ...prev, isLoading: false };
            });
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (data.error && data.error.status && data.error.status !== 401) {
            logout();
        }
    }, [data.error]);

    return (
        <AuthContext.Provider
            value={{
                user: data.user,
                isAuthenticated: !!data.user,
                isLoading: data.isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
