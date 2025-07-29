import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Grid } from "ldrs/react";

import { useAuth } from "../context/AuthContext";
import RenderIf from "../components/RenderIf";
import DashboardUsersTable from "../components/DashboardUsersTable";
import DashboardAdminTicketsTable from "../components/DashboardAdminTicketsTable";
import DashboardTechnicianTicketsTable from "../components/DashboardTechnicianTicketsTable";
import DashboardGuestTicketsTable from "../components/DashboardGuestTicketsTable";

import "ldrs/react/Grid.css";
import "ldrs/react/Ring2.css";

const API_URL = import.meta.env.VITE_API_URL;

// Hook personalizado para cargar datos del dashboard según el rol del usuario
export const useUserDashboardData = (user) => {
    const [data, setData] = useState({
        guests: [],
        technicians: [],
        tickets: [],
        users: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setIsError(null);

            const endpointsByRole = {
                admin: [
                    "users/all-guest",
                    "users/all-technicians",
                    "tickets/all-tickets",
                ],
                technician: ["tickets/my-assigned"],
                guest: ["tickets/my-tickets"],
            };

            const endpoints = endpointsByRole[user.role] || [];

            try {
                const responses = await Promise.all(
                    endpoints.map((endpoint) =>
                        fetch(`${API_URL}/${endpoint}`, {
                            method: "GET",
                            credentials: "include",
                        }).then((res) => {
                            if (!res.ok) {
                                throw new Error(
                                    `Error al obtener: ${endpoint}`
                                );
                            }
                            return res.json();
                        })
                    )
                );

                if (user.role === "admin") {
                    const [guests = [], technicians = [], tickets = []] =
                        responses;
                    setData({
                        guests,
                        technicians,
                        tickets,
                        users: [...guests, ...technicians],
                    });
                } else {
                    setData({ tickets: responses[0] || [] });
                }
            } catch (error) {
                console.error(error);
                setIsError(error);
                setData({});
            } finally {
                setIsLoading(false);
            }
        };

        if (user) fetchData();
    }, [user]);

    return { data, isLoading, isError };
};

// Componente principal del Dashboard
const Dashboard = () => {
    const { user } = useAuth();
    const { data, isError, isLoading } = useUserDashboardData(user);

    if (isLoading || isError) {
        return (
            <div className="content-area">
                <div className="content-area__body">
                    {isLoading ? (
                        <>
                            <Grid size="60" speed="1.5" color="#007bff" />
                            <p>Obteniendo datos del usuario...</p>
                        </>
                    ) : (
                        <p>Error: {isError.message}</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="content-area">
            <h1 className="content-area__title">
                Hola, {user.name.split(" ")[0]}.
            </h1>

            <div className="content-area__body">
                <RenderIf condition={user.role === "admin"}>
                    <DashboardUsersTable data={data.users} />
                    <DashboardAdminTicketsTable
                        data={{
                            tickets: data.tickets,
                            technicians: data.technicians,
                        }}
                    />
                </RenderIf>

                <RenderIf condition={user.role === "technician"}>
                    <DashboardTechnicianTicketsTable
                        data={{ tickets: data.tickets }}
                    />
                </RenderIf>

                <RenderIf condition={user.role === "guest"}>
                    <Link to="/generate-ticket" className="btn btn--primary">
                        Generar ticket
                    </Link>
                    <DashboardGuestTicketsTable
                        data={{ tickets: data.tickets }}
                    />
                </RenderIf>
            </div>
        </div>
    );
};

export default Dashboard;
