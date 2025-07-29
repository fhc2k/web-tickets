const FormSelect = ({
    name,
    label,
    register,
    error,
    disabled,
    options,
    ...rest
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
                <select
                    id={name}
                    disabled={disabled}
                    className="form-block__input"
                    {...register(name)}
                    {...rest}
                >
                    <option value="" disabled>
                        Selecciona una opción
                    </option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
            {hasError && (
                <p className="form-block__error-message">{error.message}</p>
            )}
        </div>
    );
};

export default FormSelect;
