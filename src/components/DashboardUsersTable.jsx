import { useState } from "react";
import { formatted } from "../utilities/formatDate";
import toast from "react-hot-toast";
import RenderIf from "./RenderIf";
const API_URL = import.meta.env.VITE_API_URL;

const roleToLabel = {
    admin: "Administrador",
    technician: "Técnico",
    guest: "Invitado",
};

const statusToLabel = {
    active: "Activo",
    pending: "Pendiente",
    suspended: "Suspendido",
};

const getDisplayValue = (val) => val || "Sin asignar";

const DashboardUsersTable = ({ data = [] }) => {
    const [users, setUsers] = useState(data);

    /*const handleDeleteUser = async (userId) => {
        try {
            const res = await fetch(`${API_BASE}/delete/${userId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            const { message } = await res.json();

            if (!res.ok) throw new Error(message);

            toast.success(message);
            setUsers((prev) => prev.filter((u) => u._id !== userId));
        } catch (err) {
            toast.error(err.message);
        }
    };*/

    const handleApproveOrReject = async (userId, action) => {
        try {
            const res = await fetch(`${API_URL}/users/status/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ action }),
            });

            const { message, user: updatedUser } = await res.json();

            if (!res.ok) throw new Error(message);

            toast.success(
                `Usuario ${
                    action === "approve" ? "aprobado" : "rechazado"
                } correctamente`
            );

            if (action === "approve") {
                setUsers((prev) =>
                    prev.map((u) =>
                        u._id === updatedUser._id ? updatedUser : u
                    )
                );
            } else {
                setUsers((prev) => prev.filter((u) => u._id !== userId));
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    if (!users.length) {
        return <p>No hay usuarios para mostrar.</p>;
    }

    return (
        <div className="data-table-block">
            <h2 className="data-table-block__title">Usuarios Registrados</h2>

            <table className="data-table-block__table">
                <thead className="data-table-block__header">
                    <tr className="data-table-block__row data-table-block__row--header">
                        {[
                            "Nombre",
                            "Correo",
                            "Departamento",
                            "Rol",
                            "Estado",
                            "Registrado",
                            "Acción",
                        ].map((title) => (
                            <th
                                key={title}
                                className="data-table-block__head-cell"
                            >
                                {title}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="data-table-block__body">
                    {users.map((user) => (
                        <tr
                            key={user._id}
                            className={`data-table-block__row ${
                                user.status === "pending"
                                    ? "data-table-block__row--pending"
                                    : ""
                            }`}
                        >
                            <td className="data-table-block__cell">
                                {getDisplayValue(user.name)}
                            </td>
                            <td className="data-table-block__cell">
                                {getDisplayValue(user.email)}
                            </td>
                            <td className="data-table-block__cell">
                                {user.role === "technician"
                                    ? "No aplica"
                                    : getDisplayValue(user.department)}
                            </td>
                            <td className="data-table-block__cell">
                                {roleToLabel[user.role]}
                            </td>
                            <td className="data-table-block__cell">
                                {statusToLabel[user.status]}
                            </td>
                            <td className="data-table-block__cell">
                                {formatted(user.createdAt)}
                            </td>
                            <td className="data-table-block__cell data-table-block__cell--column">
                                <RenderIf condition={user.status === "pending"}>
                                    <button
                                        className="btn btn--primary"
                                        onClick={() =>
                                            handleApproveOrReject(
                                                user._id,
                                                "approve"
                                            )
                                        }
                                    >
                                        Aprobar solictud
                                    </button>

                                    <button
                                        className="btn btn--danger"
                                        onClick={() =>
                                            handleApproveOrReject(
                                                user._id,
                                                "reject"
                                            )
                                        }
                                    >
                                        Rechazar solictud
                                    </button>
                                </RenderIf>
                                <RenderIf condition={user.status === "active"}>
                                    {/* <button
                                        className="btn btn--danger"
                                        onClick={() =>
                                            handleDeleteUser(user._id)
                                        }
                                    >
                                        Eliminar usuario
                                    </button>*/}
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

export default DashboardUsersTable;
