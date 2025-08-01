import { useState } from "react";

const UserFilters = ({ onApplyFilters, onResetFilters }) => {
    // Estado inicial para los filtros. Todos vacíos al principio.
    const initialState = {
        role: '',
        status: '',
        department: '',
        email: ''
    };

    const [filters, setFilters] = useState(initialState);

    // Manejador genérico para actualizar el estado cuando un input cambia.
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    // Se ejecuta al enviar el formulario.
    const handleSubmit = (e) => {
        e.preventDefault(); // Evita que la página se recargue
        onApplyFilters(filters);
    };

    // Se ejecuta al presionar el botón de limpiar.
    const handleReset = () => {
        setFilters(initialState); // Resetea el estado del formulario
        onResetFilters(); // Llama a la función del padre para recargar los datos sin filtros
    };

    return (
        <div className="user-filters">
            <h2 className="user-filters__title">Filtrar Usuarios</h2>
            <form className="user-filters__form" onSubmit={handleSubmit}>
                {/* Contenedor de la grilla para los filtros */}
                <div className="user-filters__grid">
                    
                    {/* Filtro por Rol */}
                    <div className="user-filters__group">
                        <label htmlFor="role" className="user-filters__label">Rol</label>
                        <select
                            id="role"
                            name="role"
                            value={filters.role}
                            onChange={handleChange}
                            className="user-filters__select"
                        >
                            <option value="">Todos</option>
                            <option value="guest">Invitado</option>
                            <option value="technician">Técnico</option>
                        </select>
                    </div>

                    {/* Filtro por Estado (Radio Buttons) */}
                    <div className="user-filters__group">
                        <span className="user-filters__label">Estado</span>
                        <div className="user-filters__radios">
                            <div className="user-filters__radio-group">
                                <input type="radio" id="status-all" name="status" value="" checked={filters.status === ''} onChange={handleChange} className="user-filters__radio-input"/>
                                <label htmlFor="status-all" className="user-filters__radio-label">Todos</label>
                            </div>
                            <div className="user-filters__radio-group">
                                <input type="radio" id="status-active" name="status" value="active" checked={filters.status === 'active'} onChange={handleChange} className="user-filters__radio-input"/>
                                <label htmlFor="status-active" className="user-filters__radio-label">Activo</label>
                            </div>
                            <div className="user-filters__radio-group">
                                <input type="radio" id="status-pending" name="status" value="pending" checked={filters.status === 'pending'} onChange={handleChange} className="user-filters__radio-input"/>
                                <label htmlFor="status-pending" className="user-filters__radio-label">Pendiente</label>
                            </div>
                        </div>
                    </div>

                    {/* Filtro por Departamento */}
                    <div className="user-filters__group">
                        <label htmlFor="department" className="user-filters__label">Departamento</label>
                        <input
                            type="text"
                            id="department"
                            name="department"
                            value={filters.department}
                            onChange={handleChange}
                            placeholder="Ej. Ventas"
                            className="user-filters__input"
                        />
                    </div>

                    {/* Filtro por Email */}
                    <div className="user-filters__group">
                        <label htmlFor="email" className="user-filters__label">Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={filters.email}
                            onChange={handleChange}
                            placeholder="Buscar por email..."
                            className="user-filters__input"
                        />
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="user-filters__actions">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="user-filters__button user-filters__button--reset"
                    >
                        Limpiar Filtros
                    </button>
                    <button
                        type="submit"
                        className="user-filters__button user-filters__button--submit"
                    >
                        Aplicar Filtros
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserFilters;