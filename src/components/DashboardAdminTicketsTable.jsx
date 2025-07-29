import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import TechnicianInput from "./TechnicianInput";
import { formatted } from "../utilities/formatDate";

const API_URL = import.meta.env.VITE_API_URL;

const TABLE_HEADERS = [
    "No. Ticket",
    "Fecha y Hora",
    "Departamento",
    "Solicitante",
    "Asunto",
    "Descripción",
    "Estado",
    "Técnico Asignado",
    "Descargar",
    "Acciones",
];

const STATUS_LABELS = {
    assigned: "Asignado",
    open: "Abierto",
    closed: "Cerrado",
};

const TicketRow = ({ ticket, activeTechnicians, onDelete }) => {
    const displayValue = (value, placeholder = "Sin asignar") =>
        value || placeholder;

    return (
        <tr key={ticket._id} className="data-table-block__row">
            <td className="data-table-block__cell">
                {ticket._id.slice(-6).toUpperCase()}
            </td>

            <td className="data-table-block__cell">
                {formatted(ticket.createdAt)}
            </td>

            <td className="data-table-block__cell">
                {displayValue(ticket.department)}
            </td>

            <td className="data-table-block__cell">
                {ticket.createdBy?.name || "Eliminado"}
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
                {ticket.assignedTo?.name ? (
                    <span className="data-table-block__technician-name">
                        {ticket.assignedTo.name}
                    </span>
                ) : activeTechnicians.length > 0 ? (
                    <TechnicianInput
                        ticket={ticket}
                        technicians={activeTechnicians}
                    />
                ) : (
                    "No hay técnicos activos."
                )}
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
};

const DashboardAdminTicketsTable = ({ data }) => {
    const { tickets = [], technicians = [] } = data;
    const [localTickets, setLocalTickets] = useState(tickets);

    useEffect(() => {
        setLocalTickets(tickets);
    }, [tickets]);

    const activeTechnicians = useMemo(
        () => technicians.filter((t) => t.status === "active"),
        [technicians]
    );

    const handleDeleteTicket = async (ticketId) => {
        const toastId = toast.loading("Eliminando ticket...");
        try {
            const response = await fetch(`${API_URL}/tickets/${ticketId}`, {
                method: "DELETE",
                credentials: "include",
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            setLocalTickets((prev) => prev.filter((t) => t._id !== ticketId));
            toast.success(result.message, { id: toastId });
        } catch (error) {
            toast.error(error.message, { id: toastId });
        }
    };

    if (localTickets.length === 0) {
        return <p>No hay tickets para mostrar.</p>;
    }

    return (
        <div className="data-table-block">
            <h2 className="data-table-block__title">Tickets de Soporte</h2>
            <table className="data-table-block__table">
                <thead className="data-table-block__header">
                    <tr className="data-table-block__row data-table-block__row--header">
                        {TABLE_HEADERS.map((head) => (
                            <th
                                key={head}
                                className="data-table-block__head-cell"
                            >
                                {head}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="data-table-block__body">
                    {localTickets.map((ticket) => (
                        <TicketRow
                            key={ticket._id}
                            ticket={ticket}
                            activeTechnicians={activeTechnicians}
                            onDelete={handleDeleteTicket}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DashboardAdminTicketsTable;
