import { Plane, MapPin, Tag, PlaneTakeoff, LogIn, HelpCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
    const { sessionState, logout } = useAuth();

    const navigate = useNavigate();

    return (
        <div className="w-full bg-primary flex flex-row h-12 items-center">
            <div className="flex-1/5 justify-center items-center mx-4">
                <div className="flex w-full">
                    <Plane stroke="white" />
                    <span className="text-white ml-2">AirFly</span>
                </div>
            </div>
            <div className="flex-3/5 flex justify-center space-x-8">
                <button
                    onClick={() => navigate("/")}
                    className="text-pink-500 hover:text-secondary transition-colors duration-200 flex items-center space-x-1 tooltip tooltip-bottom focus:outline-none"
                    data-tip="Explora nuestros viajes"
                >
                    <PlaneTakeoff className="w-4 h-4" />
                    <span>Viajes</span>
                </button>
                <button
                    onClick={() => navigate("/offers")}
                    className="text-white hover:text-secondary transition-colors duration-200 flex items-center space-x-1 tooltip tooltip-bottom"
                    data-tip="Descubre nuestras ofertas"
                >
                    <Tag className="w-4 h-4" />
                    <span>Ofertas</span>
                </button>
                <button
                    onClick={() => navigate("/destinies")}
                    className="text-white hover:text-secondary transition-colors duration-200 flex items-center space-x-1 tooltip tooltip-bottom"
                    data-tip="Conoce nuestros destinos"
                >
                    <MapPin className="w-4 h-4" />
                    <span>Destinos</span>
                </button>
            </div>
            <div className="flex-1/5 flex justify-end space-x-2 mx-4">
                {sessionState !== "authenticated" ? (
                    <button
                        onClick={() => navigate("/login")}
                        className="btn btn-ghost btn-sm text-white hover:bg-secondary hover:text-primary transition-colors duration-200 flex items-center space-x-1"
                        aria-label="Iniciar sesión"
                    >
                        <LogIn className="w-4 h-4" />
                        <span>Login</span>
                    </button>
                ) : (
                    <button
                        onClick={logout}
                        className="btn btn-ghost btn-sm text-white hover:bg-red-500 transition-colors duration-200 flex items-center space-x-1"
                        aria-label="Iniciar sesión"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </button>
                )}
                <button
                    onClick={() => navigate("/ayuda")}
                    className="btn btn-ghost btn-sm text-white hover:bg-secondary hover:text-primary transition-colors duration-200 flex items-center space-x-1"
                    aria-label="Ayuda"
                >
                    <HelpCircle className="w-4 h-4" />
                    <span>Ayuda</span>
                </button>
            </div>
        </div>
    );
}
