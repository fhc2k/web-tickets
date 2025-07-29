import Header from "./Header";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="page-container">
            <Header />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
