const FormInput = ({
    name,
    label,
    register,
    error,
    disabled,
    type = "text",
}) => {
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
                    type={type}
                    disabled={disabled}
                    className="form-block__input"
                    {...register(name)}
                />
            </div>
            {hasError && (
                <p className="form-block__error-message">{error.message}</p>
            )}
        </div>
    );
};

export default FormInput;
