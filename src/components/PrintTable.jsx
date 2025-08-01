import { formatted } from "../utilities/formatDate";

const displayValue = (value, placeholder = "Sin asignar") =>
    value || placeholder;

const PrintTable = ({ ticket }) => {
    const ticketData = [
        { label: "No. Ticket", value: ticket._id.slice(-6).toUpperCase() },
        { label: "Área Solicitante", value: displayValue(ticket.department) },
        { label: "Nombre", value: displayValue(ticket.createdBy?.name, "N/A") },
        { label: "Asunto", value: displayValue(ticket.subject) },
        { label: "Descripción", value: displayValue(ticket.description) },
        {
            label: "Técnico Asignado",
            value: displayValue(ticket.assignedTo?.name),
        },
        { label: "Fecha", value: formatted(ticket.createdAt) },
    ];

    return (
        <div className="ticket-table-block"  id="printable-area">
            <h2 className="ticket-table-block__title">Reporte de Servicio</h2>
            <table className="ticket-table-block__table">
                <thead>
                    <tr className="ticket-table-block__row ticket-table-block__row--header">
                        {ticketData.map((item) => (
                            <th
                                key={item.label}
                                className="ticket-table-block__head-cell"
                            >
                                {item.label}
                            </th>
                        ))}
                        <th className="ticket-table-block__head-cell">Firma</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="ticket-table-block__row">
                        {ticketData.map((item) => (
                            <td
                                key={item.label}
                                className="ticket-table-block__cell"
                            >
                                {item.value}
                            </td>
                        ))}
                        <td className="ticket-table-block__cell"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default PrintTable;
