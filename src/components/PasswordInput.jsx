import { useState } from "react";
const EyeOpenIcon = () => <>👁️</>;
const EyeClosedIcon = () => <>🔒</>;

const PasswordInput = ({ name, label, register, error, disabled }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const hasError = !!error;

    return (
        <div
            className={`form-block__group ${
                hasError ? "form-block__group--error" : ""
            }`}
        >
            <label className="form-block__label" htmlFor={name}>
                {label}
            </label>
            <div className="form-block__field">
                <input
                    id={name}
                    disabled={disabled}
                    className="form-block__input"
                    {...register(name)}
                    type={showPassword ? "text" : "password"}
                />

                <button
                    type="button"
                    onClick={toggleVisibility}
                    className="form-block__toggle-button"
                    aria-label={
                        showPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                    }
                >
                    {showPassword ? (
                        <i className="bxr  bx-lock" />
                    ) : (
                        <i className="bxr  bx-eye" />
                    )}
                </button>
            </div>
            {hasError && (
                <p className="form-block__error-message">{error.message}</p>
            )}
        </div>
    );
};

export default PasswordInput;
