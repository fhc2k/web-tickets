import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { registerSchema } from "../utilities/validationSchemas";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import InputPassword from "./InputPassword";
import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";
import { Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

const registerUser = async (inputs, resetForm) => {
    const { userType, confirmPassword, ...rest } = inputs;
    const payload = { ...rest, role: userType };

    try {
        const response = await fetch(
            `${API_URL}/users/register/${userType}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            }
        );

        const data = await response.json();

        if (!response.ok)  throw new Error(data.message);
        resetForm();
        toast.success(data.message);
    } catch (error) {
        toast.error(error.message);
    }
};

const RegisterForm = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        watch,
        unregister,
    } = useForm({
        shouldUnregister: true,
        resolver: yupResolver(registerSchema),
    });

    const [loading, setLoading] = useState(false);

    const userType = watch("userType");

    const onSubmit = async (inputs) => {
        setLoading(true);

        await registerUser(inputs, reset);
        setLoading(false);
    };

    useEffect(() => {
        if (userType !== "guest") {
            unregister("department", { keepDirty: false, keepTouched: false });
        }
    }, [userType, unregister]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form-block">
            <div className="form-block__header">
                <h1 className="form-block__title">Formulario de registro</h1>
                <p className="form-block__subtitle">
                    Ya tienes un usuario?{" "}
                    <Link to={"/login"} className="link">Ingresa aqui</Link>
                </p>
            </div>
            <div className="form-block__container">
                <div
                    className={`form-block__group ${
                        errors.userType && "form-block__group--error"
                    }`}
                >
                    <label className="form-block__label" htmlFor="userType">
                        Tipo de usuario
                    </label>
                    <div className="form-block__field">
                        <select
                            {...register("userType")}
                            className="form-block__input"
                            id="userType"
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Selecciona una opción
                            </option>
                            <option value="guest">Invitado</option>
                            <option value="technician">Técnico</option>
                        </select>
                    </div>
                    <p className="form-block__error-message">
                        {errors.userType?.message}
                    </p>
                </div>

                <div
                    className={`form-block__group ${
                        errors.name && "form-block__group--error"
                    }`}
                >
                    <label className="form-block__label" htmlFor="">
                        Nombre Completo
                    </label>
                    <div className="form-block__field">
                        <input
                            {...register("name")}
                            className="form-block__input"
                            type="text"
                        />
                    </div>
                    <p className="form-block__error-message">
                        {errors.name?.message}
                    </p>
                </div>

                {userType === "guest" && (
                    <div
                        className={`form-block__group ${
                            errors.department && "form-block__group--error"
                        }`}
                    >
                        <label className="form-block__label" htmlFor="">
                            Departamento
                        </label>
                        <div className="form-block__field">
                            <input
                                {...register("department")}
                                className="form-block__input"
                                type="text"
                            />
                        </div>
                        <p className="form-block__error-message">
                            {errors.department?.message}
                        </p>
                    </div>
                )}

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
                        />
                    </div>
                    <p className="form-block__error-message">
                        {errors.email?.message}
                    </p>
                </div>

                <InputPassword
                    name="password"
                    register={register("password")}
                    error={errors.password}
                    label={"Contraseña"}
                />

                <InputPassword
                    name="confirmPassword"
                    register={register("confirmPassword")}
                    error={errors.confirmPassword}
                    label={"Confirma tu contraseña"}
                />
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
                    "Registrarme"
                )}
            </button>
        </form>
    );
};

export default RegisterForm;
