import { useReactToPrint } from "react-to-print";
import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PrintTable from "../components/PrintTable";

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
                    credentials: "include",
                });
                if (!response.ok) throw new Error("Ticket no encontrado.");
                const data = await response.json();
                setTicket(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTicketData();
    }, [searchParams]);

    const handlePrint = useReactToPrint({
        content: () => contentRef.current,
        documentTitle: `Reporte-${ticket?._id || "ticket"}`,
    });

    if (isLoading)
        return (
            <p className="error-message">
                Obteniedo informacion del ticket{error}
            </p>
        );

    if (error) return <p className="error-message">Error: {error}</p>;

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
