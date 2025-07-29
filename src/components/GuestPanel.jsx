import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;
import DashboardGuestTicketsTable from "./DashboardGuestTicketsTable";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Grid } from "ldrs/react";
import "ldrs/react/Grid.css";

export const useGuestDashboardData = (user) => {
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setIsError(null);

            const guestEndpoint = "tickets/my-tickets";

            try {
                const response = await fetch(`${API_URL}/${guestEndpoint}`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message);
                }

                const data = await response.json();
                setTickets(data);
            } catch (error) {
                setIsError(error);
                setTickets([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (user && user.role === "guest") {
            fetchData();
        }
    }, [user]);
    return { tickets, isLoading, isError };
};

const GuestPanel = () => {
    const { user } = useAuth();

    const { tickets, isLoading, isError } = useGuestDashboardData(user);

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
            <Link to="/generate-ticket" className="btn btn--primary">
                Generar ticket
            </Link>
            <DashboardGuestTicketsTable data={{ tickets: tickets }} />
        </>
    );
};

export default GuestPanel;
