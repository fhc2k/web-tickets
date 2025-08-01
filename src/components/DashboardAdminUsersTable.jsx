import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { formatted } from "../utilities/formatDate";
import UserFilters from "./UsersFilter";

const API_URL = import.meta.env.VITE_API_URL;

const ROLE_LABELS = {
    admin: "Administrador",
    technician: "Técnico",
    guest: "Invitado",
};

const STATUS_LABELS = {
    active: "Activo",
    pending: "Pendiente",
    suspended: "Suspendido",
};

const TABLE_HEADERS = [
    "Nombre",
    "Correo",
    "Departamento",
    "Rol",
    "Estado",
    "Registrado",
    "Acción",
];

const displayValue = (val) => val || "Sin asignar";

const UserActions = ({ onUpdate }) => (
    <div className="data-table-block__cell--column">
        <button
            className="btn btn--primary"
            onClick={() => onUpdate("approve")}
        >
            Aprobar
        </button>
        <button className="btn btn--danger" onClick={() => onUpdate("reject")}>
            Rechazar
        </button>
    </div>
);


const UserRow = ({ user, onUpdateStatus }) => (
    <tr
        className={`data-table-block__row ${
            user.status === "pending" ? "data-table-block__row--pending" : ""
        }`}
    >
        <td className="data-table-block__cell">{displayValue(user.name)}</td>
        <td className="data-table-block__cell">{displayValue(user.email)}</td>
        <td className="data-table-block__cell">
            {user.role === "technician"
                ? "No aplica"
                : displayValue(user.department)}
        </td>
        <td className="data-table-block__cell">{ROLE_LABELS[user.role]}</td>
        <td className="data-table-block__cell">{STATUS_LABELS[user.status]}</td>
        <td className="data-table-block__cell">{formatted(user.createdAt)}</td>
        <td className="data-table-block__cell">
            {user.status === "pending" ? (
                <UserActions
                    onUpdate={(action) => onUpdateStatus(user._id, action)}
                />
            ) : (
                "No aplica"
            )}
        </td>
    </tr>
);


const DashboardAdminUsersTable = ({ data: initialUsers = [] }) => {
    const [users, setUsers] = useState(initialUsers);

    useEffect(() => {
        setUsers(initialUsers);
    }, [initialUsers]);

    const handleUpdateUserStatus = async (userId, action) => {
        const toastId = toast.loading("Actualizando usuario...");
        try {
            const response = await fetch(`${API_URL}/users/status/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ action }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            toast.success(result.message, { id: toastId });

            if (action === "approve") {
                setUsers((prev) =>
                    prev.map((u) =>
                        u._id === result.user._id ? result.user : u
                    )
                );
            } else {
                setUsers((prev) => prev.filter((u) => u._id !== userId));
            }
        } catch (error) {
            toast.error(error.message, { id: toastId });
        }
    };

    if (users.length === 0) {
        return <p>No hay usuarios para mostrar.</p>;
    }

    return (
        <div className="data-table-block">
            <h2 className="data-table-block__title">Usuarios Registrados</h2>
           <UserFilters />
            <table className="data-table-block__table">
                <thead>
                    <tr className="data-table-block__row data-table-block__row--header">
                        {TABLE_HEADERS.map((title) => (
                            <th
                                key={title}
                                className="data-table-block__head-cell"
                            >
                                {title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <UserRow
                            key={user._id}
                            user={user}
                            onUpdateStatus={handleUpdateUserStatus}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DashboardAdminUsersTable;
