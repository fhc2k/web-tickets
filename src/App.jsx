import "./App.css";
import {
    Navigate,
    createBrowserRouter,
    RouterProvider,
    ScrollRestoration,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GenerateTicket from "./pages/GenerateTicket";
import Dashboard from "./pages/Dashboard";
import Print from "./pages/Print";
import { Grid } from "ldrs/react";
import "ldrs/react/Grid.css";

import Layout from "./components/Layout";

const RequireAuth = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate replace to="/home" />;
};

const RedirectAuth = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate replace to="/dashboard" /> : children;
};

function App() {
    const { isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="page-container">
                <main className="main-content">
                    <div className="content-area">
                        <div className="content-area__body">
                            <Grid size="60" speed="1.5" color="#007bff" />
                            <p>Comprobando datos de sesion...</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const routesConfig = [
        {
            element: <Layout />,
            children: [
                { path: "/", element: <Navigate to="/home" replace /> },
                {
                    path: "/home",
                    element: (
                        <RedirectAuth>
                            <Home />
                        </RedirectAuth>
                    ),
                },

                {
                    path: "/register",
                    element: (
                        <RedirectAuth>
                            <Register />
                        </RedirectAuth>
                    ),
                },

                {
                    path: "/login",
                    element: (
                        <RedirectAuth>
                            <Login />
                        </RedirectAuth>
                    ),
                },
                {
                    path: "/dashboard",
                    element: (
                        <RequireAuth>
                            <Dashboard />
                        </RequireAuth>
                    ),
                },

                {
                    path: "/generate-ticket",
                    element: (
                        <RequireAuth>
                            <GenerateTicket />
                        </RequireAuth>
                    ),
                },
                { path: "/print", element: <Print /> },

                { path: "*", element: <Navigate to="/home" replace /> },
            ],
        },
    ];

    const router = createBrowserRouter(routesConfig);

    return (
        <RouterProvider router={router}>
            <ScrollRestoration />
        </RouterProvider>
    );
}

export default App;
