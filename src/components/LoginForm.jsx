import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { loginSchema } from "../utilities/validationSchemas";
import { useAuth } from "../context/AuthContext";
import InputPassword from "./InputPassword";
import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";
import { useState } from "react";
import { Link } from "react-router-dom";

const LoginForm = () => {
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
    });
    

    const onSubmit = async ({ email, password }) => {
        setLoading(true);

        await login({
            email,
            password,
        });

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form-block">
            <div className="form-block__header">
                <h1 className="form-block__title">Bienvenido de nuevo</h1>
                <p className="form-block__subtitle">
                    No tienes un usuario?{" "}
                    <Link to={"/register"} className="link">Registrate aqui</Link>
                </p>
            </div>
            <div className="form-block__container">
                <div
                    className={`form-block__group ${
                        errors.email && "form-block__group--error"
                    }`}
                >
                    <label className="form-block__label" htmlFor="">
                        Correo electronico
                    </label>
                    <div className="form-block__field">
                        <input
                            {...register("email")}
                            className="form-block__input"
                            type="text"
                            disabled={loading}
                        />
                    </div>
                    {errors.email ? (
                        <p className="form-block__error-message">
                            {errors.email.message}
                        </p>
                    ) : (
                        ""
                    )}
                </div>

                <InputPassword
                    name="password"
                    register={register("password")}
                    error={errors.password}
                    label={"Contraseña"}
                    disabled={loading}
                />
            </div>
            <button
                className="btn btn--primary"
                type="submit"
                disabled={Object.keys(errors).length > 0 || loading}
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
                    "Ingresar"
                )}
            </button>
        </form>
    );
};

export default LoginForm;
