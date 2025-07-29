import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { generateTicketSchema } from "../utilities/validationSchemas";
import toast from "react-hot-toast";
import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";
const API_URL = import.meta.env.VITE_API_URL;

const generateTicket = async (inputs) => {
    const payload = inputs;

    try {
        const response = await fetch(
             `${API_URL}/tickets/create`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payload),
            }
        );

        const data = await response.json();

        if (!response.ok) throw new Error(data.message);

        toast.success(data.message);
    } catch (error) {
        toast.error(error.message);
    }
};

const GenerateTicketForm = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(generateTicketSchema),
    });

    const [loading, setLoading] = useState(false);

    const onSubmit = async (inputs) => {
        setLoading(true);
        await generateTicket(inputs);
        reset();
        setLoading(false);
    };

    return (
        <form className="form-block" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-block__header">
                <h1 className="form-block__title">Generar ticket</h1>
            </div>

            <div className={`form-block__container`}>
                <div
                    className={`form-block__group ${
                        errors.subject && "form-block__group--error"
                    }`}
                >
                    <label className="form-block__label" htmlFor="">
                        Asunto
                    </label>
                    <div className="form-block__field">
                        <input
                            {...register("subject")}
                            className="form-block__input"
                            type="text"
                        />
                    </div>
                    <p className="form-block__error-message">
                        {errors.subject?.message}
                    </p>
                </div>

                <div
                    className={`form-block__group ${
                        errors.description && "form-block__group--error"
                    }`}
                >
                    <label className="form-block__label" htmlFor="">
                        Descripción
                    </label>
                    <div className="form-block__field">
                        <textarea
                            {...register("description")}
                            className="form-block__input"
                            rows="4"
                        ></textarea>
                    </div>
                    <p className="form-block__error-message">
                        {errors.description?.message}
                    </p>
                </div>
            </div>

            <button
                className="btn btn--primary"
                type="submit"
                disabled={Object.keys(errors).length || loading}
            >
                {loading ? (
                    <Ring2
                        size="20"
                        stroke="2"
                        strokeLength="0.25"
                        bgOpacity="0.1"
                        speed="0.8"
                        color="#ffffffff"
                    />
                ) : (
                    "Generar"
                )}
            </button>
        </form>
    );
};

export default GenerateTicketForm;
