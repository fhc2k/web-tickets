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
    "Fecha",
    "Asunto",
    "Descripción",
    "Estado",
    "Técnico",
    "Descargar",
    "Acciones",
];

const displayValue = (value, placeholder = "Sin asignar") =>
    value || placeholder;

const TicketRow = ({ ticket, onDelete }) => (
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
            {displayValue(ticket.assignedTo?.name)}
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
            {ticket.status === "open" ? (
                <button
                    onClick={() => onDelete(ticket._id)}
                    className="btn btn--danger"
                >
                    Eliminar
                </button>
            ) : (
                "No aplica"
            )}
        </td>
    </tr>
);

const DashboardGuestTicketsTable = ({ data }) => {
    const { tickets: initialTickets = [] } = data;
    const [localTickets, setLocalTickets] = useState(initialTickets);

    useEffect(() => {
        setLocalTickets(initialTickets);
    }, [initialTickets]);

    const handleDeleteTicket = async (ticketId) => {
        const toastId = toast.loading("Eliminando ticket...");
        try {
            const response = await fetch(`${API_URL}/tickets/${ticketId}`, {
                method: "DELETE",
                credentials: "include",
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message);

            setLocalTickets((prev) => prev.filter((t) => t._id !== ticketId));
            toast.success(result.message, { id: toastId });
        } catch (error) {
            toast.error(error.message, { id: toastId });
        }
    };

    if (localTickets.length === 0) {
        return <p>No has generado ningún ticket.</p>;
    }

    return (
        <div className="data-table-block">
            <h2 className="data-table-block__title">Mis Tickets de Soporte</h2>
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
                            onDelete={handleDeleteTicket}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DashboardGuestTicketsTable;
