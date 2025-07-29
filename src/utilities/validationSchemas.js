import * as yup from "yup";

export const loginSchema = yup.object().shape({
    email: yup.string().required("El email es obligatorio."),
    password: yup.string().required("La contraseña es obligatoria."),
});

export const registerSchema = yup.object().shape({
    userType: yup
        .string()
        .required("El tipo de usuario es obligatorio.")
        .oneOf(["guest", "technician"], "Tipo de usuario no válido"),
    name: yup
        .string()
        .required("El nombre es obligatorio.")
        .matches(
            /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
            "El nombre solo debe contener letras y espacios."
        )
        .test(
            "three-words",
            "Debes ingresar al menos tres palabras (ej. nombre y dos apellidos).",
            (value) => {
                if (!value) return false;
                const wordCount = value.trim().split(/\s+/).length;
                return wordCount >= 3;
            }
        )
        .min(10, "El nombre debe tener al menos 10 caracteres.")
        .max(60, "El nombre no debe exceder los 60 caracteres."),

    email: yup
        .string()
        .required("El correo electrónico es obligatorio.")
        .email("El correo electrónico no es válido"),

    department: yup.string().when("userType", {
        is: "guest",
        then: (schema) => schema.required("El departamento es obligatorio."),
        otherwise: (schema) => schema.notRequired(),
    }),

    password: yup
        .string()
        .required("La contraseña es obligatoria.")
        .min(6, "La contraseña debe tener al menos 6 caracteres.")
        .matches(
            /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
            "La contraseña debe tener al menos 6 caracteres, una mayúscula, un número y un carácter especial (@$!%*?&)."
        ),

    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Las contraseñas no coinciden.")
        .required("Debes confirmar tu contraseña."),
});

export const generateTicketSchema = yup.object().shape({
    subject: yup
        .string()
        .required("El asunto es obligatorio.")
        .min(5, "El asunto debe tener al menos 5 caracteres.")
        .max(100, "El asunto no debe exceder los 100 caracteres.")
        .trim("No debe contener espacios al inicio o al final."),
    description: yup
        .string()
        .required("La descripción es obligatoria.")
        .min(20, "La descripción debe tener al menos 20 caracteres.")
        .max(1000, "La descripción no debe exceder los 1000 caracteres.")
        .trim("No debe contener espacios al inicio o al final."),
});
