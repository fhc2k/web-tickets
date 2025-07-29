import { Link } from "react-router";

const Home = () => {
    return (
        <div className="content-area">
            <div className="content-area__body">
                <div className="home-block">
                    <Link to="/register" className="btn btn--primary">
                        Registrarme
                    </Link>
                    <Link
                        to="/login"
                        className="btn btn--secondary"
                    >
                        Ingresar
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
