import { useState } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const TechnicianInput = ({ ticket, technicians }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleAssignTechnician = async (e) => {
        const technicianId = e.target.value;
        if (!technicianId) return;

        setIsLoading(true);
        const toastId = toast.loading("Asignando técnico...");

        try {
            const response = await fetch(
                `${API_URL}/tickets/${ticket._id}/assign-technician`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ technicianId }),
                }
            );

            const result = await response.json();
            if (!response.ok) throw new Error(result.message);

            toast.success(result.message, { id: toastId });
        } catch (error) {
            toast.error(error.message, { id: toastId });
        } finally {
            setIsLoading(false);
            e.target.value = "";
        }
    };

    return (
        <div className="form-block__field">
            <select
                onChange={handleAssignTechnician}
                disabled={isLoading}
                className="form-block__input"
                defaultValue=""
            >
                <option value="" disabled>
                    Selecciona un técnico
                </option>
                {technicians.map(({ _id, name }) => (
                    <option key={_id} value={_id}>
                        {name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default TechnicianInput;
