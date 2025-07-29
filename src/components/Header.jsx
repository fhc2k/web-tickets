import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RenderIf from "./RenderIf";

const Header = () => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <header className="header">
            <div className="header__logo">
                <Link className="header__logo-text">DIF</Link>
            </div>
            <nav className="header__nav">
                <RenderIf condition={isAuthenticated}>
                    <button className="btn btn--primary" onClick={logout}>
                        Cerrar Sesion
                    </button>
                </RenderIf>
            </nav>
        </header>
    );
};

export default Header;
