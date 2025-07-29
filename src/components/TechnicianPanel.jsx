import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;
import DashboardTechnicianTicketsTable from "./DashboardTechnicianTicketsTable";
import { useAuth } from "../context/AuthContext";
import { Grid } from "ldrs/react";
import "ldrs/react/Grid.css";

const useTechnicianDashboardData = (user) => {
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setIsError(null);

            const technicianEndpoint = "tickets/my-assigned";

            try {
                const response = await fetch(
                    `${API_URL}/${technicianEndpoint}`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        errorData.message ||
                            "Error al obtener tus tickets asignados"
                    );
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

        if (user && user.role === "technician") {
            fetchData();
        }
    }, [user]);

    return { tickets, isLoading, isError };
};

const TechnicianPanel = () => {
    const { user } = useAuth();

    const { tickets, isLoading, isError } = useTechnicianDashboardData(user);

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

    return <DashboardTechnicianTicketsTable data={{ tickets }} />;
};

export default TechnicianPanel;
