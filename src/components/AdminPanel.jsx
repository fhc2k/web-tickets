import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;
import DashboardUsersTable from "./DashboardUsersTable";
import DashboardAdminTicketsTable from "./DashboardAdminTicketsTable";
import { useAuth } from "../context/AuthContext";
import { Grid } from "ldrs/react";
import "ldrs/react/Grid.css";

const fetchUsers = async (filters = {}) => {
    const baseURL = `${API_URL}/users`;
    const params = new URLSearchParams(filters);
    const url = `${baseURL}?${params.toString()}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        throw error;
    }
};

const useAdminDashboardData = (user) => {
    const initialState = {
        guests: [],
        technicians: [],
        tickets: [],
        users: [],
    };

    const [data, setData] = useState(initialState);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setIsError(null);

            try {
                const [guestsData, techniciansData, ticketsData] =
                    await Promise.all([
                        fetchUsers({ role: "guest" }),
                        fetchUsers({ role: "technician" }),

                        fetch(`${API_URL}/tickets`, {
                            credentials: "include",
                        }).then((res) => {
                            if (!res.ok)
                                throw new Error("Error al obtener los tickets");
                            return res.json();
                        }),
                    ]);

                const allUsers = [...guestsData, ...techniciansData];

                setData({
                    guests: guestsData,
                    technicians: techniciansData,
                    tickets: ticketsData,
                    users: allUsers,
                });
            } catch (error) {
                setIsError(error.message);
                setData(initialState);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user]);

    return { data, isLoading, isError };
};

const AdminPanel = () => {
    const { user } = useAuth();

    const { data, isLoading, isError } = useAdminDashboardData(user);

    if (isLoading) {
        return (
            <>
                <Grid size="60" speed="1.5" color="#007bff" />
                <p>Obteniendo datos...</p>
            </>
        );
    }

    if (isError) {
        return <div className="error-message">{isError}</div>;
    }

    return (
        <>
            <DashboardUsersTable data={data.users} />

            <DashboardAdminTicketsTable
                data={{
                    tickets: data.tickets,
                    technicians: data.technicians,
                }}
            />
        </>
    );
};

export default AdminPanel;
