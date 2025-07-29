import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";

import { registerSchema } from "../utilities/validationSchemas";
import { registerUser } from "../services/authService";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import PasswordInput from "./PasswordInput";

const userTypeOptions = [
    { value: "guest", label: "Invitado" },
    { value: "technician", label: "Técnico" },
];

const RegisterForm = () => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(registerSchema),
        defaultValues: { userType: "" },
    });

    const userType = watch("userType");

    const onSubmit = async (data) => {
        try {
            await registerUser(data);
            reset();
        } catch (error) {
            console.error("Fallo en el registro:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form-block">
            <div className="form-block__header">
                <h1 className="form-block__title">Formulario de registro</h1>
                <p className="form-block__subtitle">
                    ¿Ya tienes un usuario?{" "}
                    <Link to="/login" className="link">
                        Ingresa aquí
                    </Link>
                </p>
            </div>

            <div className="form-block__container">
                <FormSelect
                    name="userType"
                    label="Tipo de usuario"
                    register={register}
                    error={errors.userType}
                    disabled={isSubmitting}
                    options={userTypeOptions}
                />

                <FormInput
                    name="name"
                    label="Nombre Completo"
                    register={register}
                    error={errors.name}
                    disabled={isSubmitting}
                />

                {userType === "guest" && (
                    <FormInput
                        name="department"
                        label="Departamento"
                        register={register}
                        error={errors.department}
                        disabled={isSubmitting}
                    />
                )}

                <FormInput
                    name="email"
                    label="Correo electrónico"
                    type="email"
                    register={register}
                    error={errors.email}
                    disabled={isSubmitting}
                />

                <PasswordInput
                    name="password"
                    label="Contraseña"
                    register={register}
                    error={errors.password}
                    disabled={isSubmitting}
                />

                <PasswordInput
                    name="confirmPassword"
                    label="Confirma tu contraseña"
                    register={register}
                    error={errors.confirmPassword}
                    disabled={isSubmitting}
                />
            </div>

            <button
                className="btn btn--primary"
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <Ring2 size="20" stroke="2" color="#ffffffff" />
                ) : (
                    "Registrarme"
                )}
            </button>
        </form>
    );
};

export default RegisterForm;
