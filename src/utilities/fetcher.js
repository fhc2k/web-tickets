export const fetcher = async (endpoint, options = {}) => {
    const BASE_URL = import.meta.env.VITE_API_URL;

    const res = await fetch(BASE_URL + endpoint, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        credentials: "include",
        ...options,
    });

    if (!res.ok) {
        const errorData = await res.json();
        const error = new Error(
            errorData.message || "Ocurrió un error al obtener los datos."
        );

        error.status = res.status;
        throw error;
    }

    return res.json();
};

