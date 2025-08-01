import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { formatted } from "../utilities/formatDate";

const API_URL = import.meta.env.VITE_API_URL;

const STATUS_LABELS = {
    assigned: "Asignado",
    open: "Abierto",
    closed: "Cerrado",
};

const TABLE_HEADERS = [
    "No. Ticket",
    "Fecha y Hora",
    "Asunto",
    "Descripción",
    "Estado",
    "Descargar",
    "Acciones",
];

const displayValue = (value, placeholder = "N/A") => value || placeholder;

const TicketRow = ({ ticket, onClose }) => (
    <tr className="data-table-block__row">
        <td className="data-table-block__cell">
            {ticket._id.slice(-6).toUpperCase()}
        </td>
        <td className="data-table-block__cell">
            {formatted(ticket.createdAt)}
        </td>
        <td className="data-table-block__cell">
            {displayValue(ticket.subject)}
        </td>
        <td className="data-table-block__cell">
            {displayValue(ticket.description)}
        </td>
        <td className="data-table-block__cell">
            <span className={`status-label status-label--${ticket.status}`}>
                {STATUS_LABELS[ticket.status] || ticket.status}
            </span>
        </td>
        <td className="data-table-block__cell">
            <Link
                to={`/print?id=${ticket._id}`}
                className="data-table-block__button data-table-block__button--download"
            >
                PDF
            </Link>
        </td>
        <td className="data-table-block__cell">
            {ticket.status === "assigned" ? (
                <button
                    onClick={() => onClose(ticket._id)}
                    className="btn btn--primary"
                >
                    Cerrar ticket
                </button>
            ) : (
                "No aplica"
            )}
        </td>
    </tr>
);


const DashboardTechnicianTicketsTable = ({ data }) => {
    const { tickets: initialTickets = [] } = data;
    const [localTickets, setLocalTickets] = useState(initialTickets);

    useEffect(() => {
        setLocalTickets(initialTickets);
    }, [initialTickets]);

    const handleCloseTicket = async (ticketId) => {
        const toastId = toast.loading("Cerrando ticket...");
        try {
            const response = await fetch(
                `${API_URL}/tickets/my-assigned/${ticketId}/close`,
                {
                    method: "PATCH",
                    credentials: "include",
                }
            );

            const result = await response.json();
            if (!response.ok) throw new Error(result.message);

            setLocalTickets((prev) =>
                prev.map((t) =>
                    t._id === result.ticket._id ? result.ticket : t
                )
            );

            toast.success(result.message, { id: toastId });
        } catch (error) {
            toast.error(error.message, { id: toastId });
        }
    };

    if (localTickets.length === 0) {
        return <p>No tienes tickets asignados.</p>;
    }

    return (
        <div className="data-table-block">
            <h2 className="data-table-block__title">Mis Tickets Asignados</h2>
            <table className="data-table-block__table">
                <thead>
                    <tr className="data-table-block__row data-table-block__row--header">
                        {TABLE_HEADERS.map((header) => (
                            <th
                                key={header}
                                className="data-table-block__head-cell"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {localTickets.map((ticket) => (
                        <TicketRow
                            key={ticket._id}
                            ticket={ticket}
                            onClose={handleCloseTicket}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DashboardTechnicianTicketsTable;
