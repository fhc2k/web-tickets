import { useState } from "react";

const InputPassword = ({ name, register, error, label, ...rest }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div
            className={`form-block__group ${
                error && "form-block__group--error"
            }`}
        >
            <label className="form-block__label" htmlFor={name}>
                {label}
            </label>
            <div className="form-block__field">
                <input
                    {...register}
                    id={name}
                    className="form-block__input"
                    type={showPassword ? "text" : "password"}
                    {...rest}
                />
                <div className="form-block__toggle-visibility">
                    <input
                        id={"show-" + name}
                        onChange={toggleVisibility}
                        type="checkbox"
                        className="form-block__toggle-checkbox"
                    />
                    <label
                        htmlFor={"show-" + name}
                        className="form-block__toggle-label"
                    >
                        {showPassword ? "Ocultar" : "Mostrar"}
                    </label>
                </div>
            </div>
            {error ? (
                <p className="form-block__error-message">{error?.message}</p>
            ) : (
                ""
            )}
        </div>
    );
};

export default InputPassword;
