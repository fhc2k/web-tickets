import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;
import DashboardUsersTable from "./DashboardUsersTable";
import DashboardAdminTicketsTable from "./DashboardAdminTicketsTable";
import { useAuth } from "../context/AuthContext";
import { Grid } from "ldrs/react";
import "ldrs/react/Grid.css";

export const useAdminDashboardData = (user) => {
    const initialState = {
        guests: [],
        technicians: [],
        tickets: [],
        users: [],
    };

    const [data, setData] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setIsError(null);

            const adminEndpoints = [
                "users/all-guest",
                "users/all-technicians",
                "tickets/all-tickets",
            ];

            try {
                const responses = await Promise.all(
                    adminEndpoints.map((endpoint) =>
                        fetch(`${API_URL}/${endpoint}`, {
                            method: "GET",
                            credentials: "include",
                        }).then(async (res) => {
                            if (!res.ok) {
                                const errorData = await res.json();
                                throw new Error(
                                    errorData.message ||
                                        "Error al obtener los datos"
                                );
                            }
                            return res.json();
                        })
                    )
                );

                const [guests = [], technicians = [], tickets = []] = responses;

                setData({
                    guests,
                    technicians,
                    tickets,
                    users: [...guests, ...technicians],
                });
            } catch (error) {
                setIsError(error);

                setData(initialState);
            } finally {
                setIsLoading(false);
            }
        };

        if (user && user.role === "admin") {
            fetchData();
        }
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
        return <div className="error-message">{isError.message}</div>;
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
