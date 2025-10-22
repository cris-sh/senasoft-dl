import { User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fetchApiData } from "../../../shared/hooks/useApi";
import { toast } from "react-toastify";
import { useAuth } from "../../../shared/hooks/useAuth";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        const response = await fetchApiData("post", "auth/login", data);
        if (response?.message === "ok") {
            login(response.data.token);
            toast.success("Inicio de sesión exitoso");
            navigate("/");
        } else {
            toast.error(response?.message || "Error en el inicio de sesión");
        }
    };

    return (
        <div className="hero bg-primary min-h-screen">
            <div className="hero-content flex-col lg:flex-row w-full">
                <div className="w-full lg:w-1/2 text-center lg:text-left flex flex-col justify-center px-6">
                    <h1 className="text-5xl font-bold text-white">Inicia sesión en AirFly</h1>
                    <p className="py-6 text-lg text-white">
                        Accede a tu cuenta para reservar vuelos, gestionar tus viajes y disfrutar de
                        ofertas exclusivas. Conecta con el mundo desde las alturas.
                    </p>
                </div>
                <div className="w-full lg:w-1/2 flex justify-center">
                    <div className="card bg-base-100 w-full max-w-md shadow-2xl">
                        <div className="w-full flex justify-center py-6">
                            <div className="avatar">
                                <div className="w-20 h-20 flex justify-center items-center rounded-full bg-gray-100 border-2 border-gray-300">
                                    <User className="w-12 h-12 text-gray-500" strokeWidth={1.5} />
                                </div>
                            </div>
                        </div>

                        <div className="card-body m-4">
                            <form onSubmit={handleSubmit}>
                                <fieldset className="fieldset">
                                    <label className="label">
                                        <span className="label-text">Correo electrónico</span>
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        className="input input-bordered w-full"
                                        placeholder="tu@email.com"
                                    />
                                    <label className="label">
                                        <span className="label-text">Contraseña</span>
                                    </label>
                                    <input
                                        name="password"
                                        type="password"
                                        className="input input-bordered w-full"
                                        placeholder="Contraseña"
                                    />
                                    <div className="mt-2">
                                        <a className="link link-hover text-sm">
                                            ¿Olvidaste tu contraseña?
                                        </a>
                                    </div>
                                    <button className="btn btn-primary mt-4 w-full">
                                        Iniciar sesión
                                    </button>
                                </fieldset>
                            </form>
                            <div className="mt-2">
                                <span className=" text-sm">
                                    No tienes una cuenta?{" "}
                                    <Link to="/register" className="link link-hover text-primary">
                                        Registrate
                                    </Link>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
