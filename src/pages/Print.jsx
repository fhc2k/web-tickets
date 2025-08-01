import { useReactToPrint } from "react-to-print";
import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PrintTable from "../components/PrintTable";
import { Grid } from "ldrs/react";
import "ldrs/react/Grid.css";

const API_URL = import.meta.env.VITE_API_URL;

const Report = () => {
    const contentRef = useRef(null);
    const [searchParams] = useSearchParams();

    const [ticket, setTicket] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const ticketId = searchParams.get("id");

        if (!ticketId) {
            setError("No se proporcionó un ID de ticket en la URL.");
            setIsLoading(false);
            return;
        }

        const fetchTicketData = async () => {
            try {
                const response = await fetch(`${API_URL}/tickets/${ticketId}`, {
                    method: "GET",
                    credentials: "include",
                });

                const data = await response.json();

                if (!response.ok) throw new Error(data.message);

                setTicket(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTicketData();
    }, [searchParams]);

    const handlePrint = useReactToPrint({
        contentRef: contentRef,
        documentTitle: `Reporte-${ticket?._id || "ticket"}`,
    });

    if (isLoading) {
        return (
            <>
                <Grid size="60" speed="1.5" color="#007bff" />
                <p>Obteniendo datos del ticket...</p>
            </>
        );
    }

    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="content-area">
            <h1 className="content-area__title">Detalles del Ticket</h1>
            <div className="content-area__body">
                <div className="report-block">
                    <div ref={contentRef}>
                        <PrintTable ticket={ticket} />
                    </div>
                    <button className="btn btn--primary" onClick={handlePrint}>
                        Imprimir Reporte
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Report;
