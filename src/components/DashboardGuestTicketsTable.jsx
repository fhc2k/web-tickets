import { Link } from "react-router-dom";
import { formatted } from "../utilities/formatDate";
import { useState } from "react";
import toast from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL;


const DashboardGuestTicketsTable = ({ data }) => {
    const { tickets } = data;
    const [localTickets, setLocalTickets] = useState(tickets);

    const statusLabels = {
        assigned: "Asignado",
        open: "Abierto",
        closed: "Cerrado",
    };

    const handleDisplayValue = (value) => {
        if (value === undefined || value === "") return "Sin asignar";
        return value;
    };

    const handleDeleteTicket = async (ticketId) => {
        try {
            const res = await fetch(
                `${API_URL}/tickets/${ticketId}`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                }
            );

            const { message } = await res.json();

            if (!res.ok) throw new Error(message);

            setLocalTickets((prev) => prev.filter((t) => t._id !== ticketId));

            toast.success(message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (!localTickets.length) {
        return <p>No hay tickets para mostrar.</p>;
    }

    return (
        <div className="data-table-block">
            <h2 className="data-table-block__title">Tickets de Soporte</h2>
            <table className="data-table-block__table">
                <thead className="data-table-block__header">
                    <tr className="data-table-block__row data-table-block__row--header">
                        <th className="data-table-block__head-cell">
                            No. Ticket
                        </th>
                        <th className="data-table-block__head-cell">
                            Fecha y Hora
                        </th>
                        <th className="data-table-block__head-cell">Asunto</th>
                        <th className="data-table-block__head-cell">
                            Descripción
                        </th>
                        <th className="data-table-block__head-cell">Estado</th>
                        <th className="data-table-block__head-cell">
                            Técnico Asignado
                        </th>
                        <th className="data-table-block__head-cell">
                            Descargar
                        </th>
                        <th className="data-table-block__head-cell">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody className="data-table-block__body">
                    {localTickets.map((ticket) => (
                        <tr key={ticket._id} className="data-table-block__row">
                            <td className="data-table-block__cell">
                                {handleDisplayValue(
                                    ticket._id.slice(-6).toUpperCase()
                                )}
                            </td>

                            <td className="data-table-block__cell">
                                {handleDisplayValue(
                                    formatted(ticket.createdAt)
                                )}
                            </td>
                            <td className="data-table-block__cell">
                                {handleDisplayValue(ticket.subject)}
                            </td>
                            <td className="data-table-block__cell">
                                {handleDisplayValue(ticket.description)}
                            </td>
                            <td className="data-table-block__cell">
                                <span
                                    className={`status-label status-label--${ticket.status}`}
                                >
                                    {statusLabels[ticket.status]}
                                </span>
                            </td>
                            <td className="data-table-block__cell">
                                {handleDisplayValue(ticket.assignedTo?.name)}
                            </td>

                            <td className="data-table-block__cell">
                                <Link
                                    to={`/print?id=${
                                        ticket._id
                                    }&area=${encodeURIComponent(
                                        ticket.department
                                    )}&name=${encodeURIComponent(
                                        ticket.name
                                    )}&subject=${encodeURIComponent(
                                        ticket.subject
                                    )}&description=${encodeURIComponent(
                                        ticket.description
                                    )}&technician=${
                                        ticket.technician
                                            ? encodeURIComponent(
                                                  ticket.technician
                                              )
                                            : ""
                                    }&createdAt=${ticket.createdAt}`}
                                    className="data-table-block__button data-table-block__button--download"
                                >
                                    PDF
                                </Link>
                            </td>
                            <td className="data-table-block__cell">
                                {ticket.status === "open" ? (
                                    <button
                                        onClick={() =>
                                            handleDeleteTicket(ticket._id)
                                        }
                                        className="btn btn--danger"
                                    >
                                        Eliminar
                                    </button>
                                ) : (
                                    "No aplica"
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DashboardGuestTicketsTable;
