// src/components/LoginForm.jsx

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";

import { loginSchema } from "../utilities/validationSchemas";
import { useAuth } from "../context/AuthContext";
import FormInput from "./FormInput";
import PasswordInput from "./PasswordInput";

const LoginForm = () => {
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        await login(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form-block">
            <div className="form-block__header">
                <h1 className="form-block__title">Bienvenido de nuevo</h1>
                <p className="form-block__subtitle">
                    ¿No tienes un usuario?{" "}
                    <Link to="/register" className="link">
                        Regístrate aquí
                    </Link>
                </p>
            </div>

            <div className="form-block__container">
                <FormInput
                    name="email"
                    label="Correo electrónico"
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
            </div>

            <button
                className="btn btn--primary"
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <Ring2 size="20" stroke="2" color="#ffffffff" />
                ) : (
                    "Ingresar"
                )}
            </button>
        </form>
    );
};

export default LoginForm;
