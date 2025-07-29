import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
// import socket from "../socket";
import TechnicianInput from "./TechnicianInput";
import { formatted } from "../utilities/formatDate";
import RenderIf from "./RenderIf";
const API_URL = import.meta.env.VITE_API_URL;

const DashboardAdminTicketsTable = ({ data }) => {
    const { tickets, technicians } = data;
    const [localTickets, setLocalTickets] = useState(tickets);
    const [activeTechnicians, setActiveTechnicians] = useState([]);

    useEffect(() => {
        setActiveTechnicians(technicians.filter((t) => t.status === "active"));
    }, [technicians]);

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

    /*useEffect(() => {
        const handleTicketUpdate = (updatedTicket) => {
            setLocalTickets((prev) =>
                prev.map((t) =>
                    t._id === updatedTicket._id ? updatedTicket : t
                )
            );
        };

        const handleTicketCreate = (newTicket) => {
            setLocalTickets((prev) => {
                const exists = prev.some((t) => t._id === newTicket._id);
                return exists ? prev : [...prev, newTicket];
            });
        };

        const handleTicketDelete = (deletedTicket) => {
            setLocalTickets((prev) =>
                prev.filter((t) => t._id !== deletedTicket._id)
            );
        };

        socket.on("connect", () => {
            console.log("🟢 Socket conectado:", socket.id);
        });

        socket.on("ticket-updated", handleTicketUpdate);
        socket.on("ticket-created", handleTicketCreate);
        socket.on("ticket-deleted", handleTicketDelete);

        return () => {
            socket.off("ticket-updated", handleTicketUpdate);
            socket.off("ticket-created", handleTicketCreate);
            socket.off("ticket-deleted", handleTicketDelete);
            socket.off("connect");
            socket.disconnect();
        };
    }, []);*/

    if (!localTickets.length) {
        return <p>No hay tickets para mostrar.</p>;
    }

    return (
        <div className="data-table-block">
            <h2 className="data-table-block__title">Tickets de Soporte</h2>
            <table className="data-table-block__table">
                <thead className="data-table-block__header">
                    <tr className="data-table-block__row data-table-block__row--header">
                        {[
                            "No. Ticket",
                            "Fecha y Hora",
                            "Departamento Solicitante",
                            "Nombre del Solicitante",
                            "Asunto",
                            "Descripción",
                            "Estado",
                            "Técnico Asignado",
                            "Descargar",
                            "Acciones",
                        ].map((head, idx) => (
                            <th
                                key={idx}
                                className="data-table-block__head-cell"
                            >
                                {head}
                            </th>
                        ))}
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
                                {handleDisplayValue(ticket.department)}
                            </td>
                            <td className="data-table-block__cell">
                                {ticket.createdBy?.name || "Eliminado"}
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
                                    {statusLabels[ticket.status] ||
                                        ticket.status}
                                </span>
                            </td>
                            <td className="data-table-block__cell">
                                {ticket.assignedTo && ticket.assignedTo.name ? (
                                    <span className="data-table-block__technician-name">
                                        {ticket.assignedTo.name}
                                    </span>
                                ) : activeTechnicians.length ? (
                                    <TechnicianInput
                                        data={{
                                            ticket,
                                            technicians: activeTechnicians,
                                        }}
                                    />
                                ) : (
                                    "No hay técnicos activos para asignar."
                                )}
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
                                        ticket.technician || ""
                                    }&createdAt=${ticket.createdAt}`}
                                    className="data-table-block__button data-table-block__button--download"
                                >
                                    PDF
                                </Link>
                            </td>
                            <td className="data-table-block__cell">
                                <RenderIf condition={ticket.status === "open"}>
                                    <button
                                        onClick={() =>
                                            handleDeleteTicket(ticket._id)
                                        }
                                        className="btn btn--danger"
                                    >
                                        Eliminar
                                    </button>
                                </RenderIf>
                                <RenderIf condition={ticket.status !== "open"}>
                                    No aplica
                                </RenderIf>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DashboardAdminTicketsTable;
