import AdminPanel from "../components/AdminPanel";
import TechnicianPanel from "../components/TechnicianPanel";
import GuestPanel from "../components/GuestPanel";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const { user } = useAuth();

    let Panel;
    if (user.role === "admin") {
        Panel = AdminPanel;
    } else if (user.role === "technician") {
        Panel = TechnicianPanel;
    } else if (user.role === "guest") {
        Panel = GuestPanel;
    }

    return (
        <div className="content-area">
            <h1 className="content-area__title">
                Hola, {user.name.split(" ")[0]}.
            </h1>
            <div className="content-area__body">
                {Panel ? <Panel /> : <p>Acceso no autorizado</p>}
            </div>
        </div>
    );
};

export default Dashboard;
