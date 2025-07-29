import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <App />
    </AuthProvider>
);
