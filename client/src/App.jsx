import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// contexts
import AuthProvider from "./shared/contexts/AuthenticationContext";
import ThemeProvider from "./shared/contexts/ThemeContext";

// components
import ProtectedRoute from "./shared/layouts/ProtectedRoute";
import GuestLayout from "./shared/layouts/GuestLayout";
import Login from "./modules/auth/pages/Login";
import AppLayout from "./shared/layouts/AppLayout";
import Home from "./shared/pages/Home";
import Register from "./modules/auth/pages/Register";
import AvailableFligths from "./modules/flights/pages/AvailableFligths";
import NotFound from "./shared/pages/NotFound";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ThemeProvider>
                    <Routes>
                        <Route element={<ProtectedRoute mustBeAuth={false} />}>
                            {/* Entrypoint */}
                            <Route element={<AppLayout/>}>
                                <Route index element={<Home />} path="/" />
                                <Route element={<AvailableFligths />} path="/flights/available" />
                            </Route>

                            {/* Rutas de autenticacion */}
                            <Route element={<GuestLayout />}>
                                <Route element={<Login />} path="/login" />
                                <Route element={<Register />} path="/register" />
                            </Route>
                        </Route>

                        <Route element={<ProtectedRoute mustBeAuth />}>
                            <Route element={<AppLayout />}>

                            </Route>
                        </Route>

                        {/* Ruta 404 - debe ir al final */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </ThemeProvider>
            </AuthProvider>
            <ToastContainer position="top-rigth" />
        </BrowserRouter>
    );
}

export default App;

