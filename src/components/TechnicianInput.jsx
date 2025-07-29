import toast from "react-hot-toast";
import { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

const TechnicianInput = ({ data }) => {
    const { ticket, technicians } = data;
    const [selectedTechnician, setSelectedTechnician] = useState("");

    const handleTechnicianChange = async (e) => {
        const technicianId = e.target.value;
        setSelectedTechnician(technicianId);

        if (!technicianId) return;

        const payload = { technicianId };

        try {
            const response = await fetch(
                `${API_URL}/tickets/${ticket._id}/assign-technician`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(payload),
                }
            );

            const result = await response.json();

            if (!response.ok) throw new Error(result.message);

            toast.success(result.message);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSelectedTechnician("");
        }
    };

    return (
        <div className="form-block__field">
            <select
                id="assignTechnicianSelect"
                name="assignTechnicianSelect"
                onChange={handleTechnicianChange}
                className="form-block__input"
                value={selectedTechnician}
            >
                <option value="" disabled>
                    Selecciona una opción
                </option>
                {technicians.map(({ name, _id }) => (
                    <option key={_id} value={_id}>
                        {name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default TechnicianInput;
