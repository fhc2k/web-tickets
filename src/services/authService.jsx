import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (formData) => {
    const { confirmPassword, userType, ...rest } = formData;

    const payload = {
        ...rest,
        role: userType,
    };

    const toastId = toast.loading("Registrando usuario...");

    try {
        const response = await fetch(`${API_URL}/users/register/${userType}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        toast.success(data.message, { id: toastId });
        return { success: true };
    } catch (error) {
        toast.error(error.message, { id: toastId });
        throw error;
    }
};
