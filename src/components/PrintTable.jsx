const ReportTable = ({ data }) => {
    console.log(data);
    const { id, area, name, subject, description, technician, createdAt } =
        data;

    const handleErrorsData = (field) => {
        return field === undefined
            ? "Sin datos"
            : field === ""
            ? "Sin asignar"
            : field;
    };

    return (
        <div className="ticket-table-block">
            <table className="ticket-table-block__table">
                <thead className="ticket-table-block__header">
                    <tr className="ticket-table-block__row ticket-table-block__row--header">
                        <th className="ticket-table-block__head-cell">
                            No. Ticket
                        </th>
                        <th className="ticket-table-block__head-cell">
                            Área Solicitante
                        </th>
                        <th className="ticket-table-block__head-cell">
                            Nombre
                        </th>
                        <th className="ticket-table-block__head-cell">
                            Asunto
                        </th>
                        <th className="ticket-table-block__head-cell">
                            Descripción
                        </th>
                        <th className="ticket-table-block__head-cell">
                            Técnico asignado
                        </th>
                        <th className="ticket-table-block__head-cell">Firma</th>
                    </tr>
                </thead>
                <tbody className="ticket-table-block__body">
                    <tr>
                        <td className="ticket-table-block__cell">
                            {handleErrorsData(id)}
                        </td>
                        <td className="ticket-table-block__cell">
                            {handleErrorsData(area)}
                        </td>
                        <td className="ticket-table-block__cell">
                            {handleErrorsData(name)}
                        </td>
                        <td className="ticket-table-block__cell">
                            {handleErrorsData(subject)}
                        </td>
                        <td className="ticket-table-block__cell">
                            {handleErrorsData(description)}
                        </td>
                        <td className="ticket-table-block__cell">
                            {handleErrorsData(technician)}
                        </td>
                        <td className="ticket-table-block__cell"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ReportTable;
