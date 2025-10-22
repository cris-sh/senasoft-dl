import { Link, useNavigate } from "react-router-dom";
import { fetchApiData } from "../../../shared/hooks/useApi";
import { toast } from "react-toastify";
import { useState } from "react";

export default function Register() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        role: 'user'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("📝 Register: Attempting registration with", formData);
        const response = await fetchApiData("post", "auth/register", formData);
        console.log("📝 Register: Response received", response);
        if (response?.message === "ok") {
            console.log("✅ Register: Success");
            toast.success("Registro exitoso. Ahora puedes iniciar sesión.");
            navigate("/login");
        } else {
            console.log("❌ Register: Failed", response);
            toast.error(response?.message || "Error en el registro");
        }
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    return (
        <div className="hero bg-primary min-h-screen">
            <div className="hero-content flex-col lg:flex-row w-full">
                <div className="w-full lg:w-1/3 text-center lg:text-left flex flex-col justify-center px-6">
                    <h1 className="text-4xl font-bold text-white">Regístrate en AirFly</h1>
                    <p className="py-4 text-base text-white">
                        Únete a AirFly y comienza a planificar tus viajes. Crea tu cuenta para
                        acceder a ofertas exclusivas.
                    </p>
                </div>
                <div className="w-full lg:w-2/3 flex justify-center">
                    <div className="card bg-base-100 w-full max-w-md shadow-2xl">
                        <div className="card-body">
                            <div className="flex justify-center mb-4">
                                <ul className="steps steps-horizontal">
                                    <li className={`step ${step >= 1 ? "step-primary" : ""}`}>
                                        Información
                                    </li>
                                    <li className={`step ${step >= 2 ? "step-primary" : ""}`}>
                                        Documento
                                    </li>
                                    <li className={`step ${step >= 3 ? "step-primary" : ""}`}>
                                        Seguridad
                                    </li>
                                </ul>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {step === 1 && (
                                    <fieldset className="fieldset">
                                        <label className="label">
                                            <span className="label-text">Correo electrónico *</span>
                                        </label>
                                        <input
                                            name="email"
                                            type="email"
                                            className="input input-bordered w-full"
                                            placeholder="tu@email.com"
                                            value={formData.email || ''}
                                            onChange={handleInputChange}
                                            required
                                        />

                                        <label className="label">
                                            <span className="label-text">Nombre *</span>
                                        </label>
                                        <input
                                            name="name"
                                            type="text"
                                            className="input input-bordered w-full"
                                            placeholder="Juan"
                                            value={formData.name || ''}
                                            onChange={handleInputChange}
                                            required
                                        />

                                        <label className="label">
                                            <span className="label-text">Apellido paterno *</span>
                                        </label>
                                        <input
                                            name="lastname"
                                            type="text"
                                            className="input input-bordered w-full"
                                            placeholder="Pérez"
                                            value={formData.lastname || ''}
                                            onChange={handleInputChange}
                                            required
                                        />

                                        <label className="label">
                                            <span className="label-text">Apellido materno</span>
                                        </label>
                                        <input
                                            name="snd_lastname"
                                            type="text"
                                            className="input input-bordered w-full"
                                            placeholder="González"
                                            value={formData.snd_lastname || ''}
                                            onChange={handleInputChange}
                                        />

                                        <label className="label">
                                            <span className="label-text">Teléfono *</span>
                                        </label>
                                        <input
                                            name="phone"
                                            type="tel"
                                            className="input input-bordered w-full"
                                            placeholder="+34123456789"
                                            value={formData.phone || ''}
                                            onChange={handleInputChange}
                                            required
                                        />

                                        <div className="flex justify-end mt-4">
                                            <button
                                                type="button"
                                                onClick={nextStep}
                                                className="btn btn-primary"
                                            >
                                                Siguiente
                                            </button>
                                        </div>
                                    </fieldset>
                                )}

                                {step === 2 && (
                                    <fieldset className="fieldset">
                                        <label className="label">
                                            <span className="label-text">
                                                Fecha de nacimiento *
                                            </span>
                                        </label>
                                        <input
                                            name="bday"
                                            type="date"
                                            className="input input-bordered w-full"
                                            value={formData.bday || ''}
                                            onChange={handleInputChange}
                                            required
                                        />

                                        <label className="label">
                                            <span className="label-text">Género *</span>
                                        </label>
                                        <select
                                            name="gender"
                                            className="select select-bordered w-full"
                                            value={formData.gender || ''}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Seleccionar género</option>
                                            <option value="male">Masculino</option>
                                            <option value="female">Femenino</option>
                                            <option value="other">Otro</option>
                                        </select>

                                        <label className="label">
                                            <span className="label-text">Tipo de documento *</span>
                                        </label>
                                        <select
                                            name="doc_type"
                                            className="select select-bordered w-full"
                                            value={formData.doc_type || ''}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Seleccionar tipo</option>
                                            <option value="DNI">DNI</option>
                                            <option value="passport">Pasaporte</option>
                                            <option value="license">Licencia</option>
                                        </select>

                                        <label className="label">
                                            <span className="label-text">
                                                Número de documento *
                                            </span>
                                        </label>
                                        <input
                                            name="doc_num"
                                            type="text"
                                            className="input input-bordered w-full"
                                            placeholder="12345678"
                                            value={formData.doc_num || ''}
                                            onChange={handleInputChange}
                                            required
                                        />

                                        <div className="flex justify-between mt-4">
                                            <button
                                                type="button"
                                                onClick={prevStep}
                                                className="btn btn-outline"
                                            >
                                                Anterior
                                            </button>
                                            <button
                                                type="button"
                                                onClick={nextStep}
                                                className="btn btn-primary"
                                            >
                                                Siguiente
                                            </button>
                                        </div>
                                    </fieldset>
                                )}

                                {step === 3 && (
                                    <fieldset className="fieldset">
                                        <label className="label">
                                            <span className="label-text">Contraseña *</span>
                                        </label>
                                        <input
                                            name="password"
                                            type="password"
                                            className="input input-bordered w-full"
                                            placeholder="Contraseña"
                                            value={formData.password || ''}
                                            onChange={handleInputChange}
                                            required
                                        />

                                        <label className="label">
                                            <span className="label-text">
                                                Confirmar contraseña *
                                            </span>
                                        </label>
                                        <input
                                            name="confirmPassword"
                                            type="password"
                                            className="input input-bordered w-full"
                                            placeholder="Confirmar contraseña"
                                            value={formData.confirmPassword || ''}
                                            onChange={handleInputChange}
                                            required
                                        />

                                        <div className="flex justify-between mt-4">
                                            <button
                                                type="button"
                                                onClick={prevStep}
                                                className="btn btn-outline"
                                            >
                                                Anterior
                                            </button>
                                            <button className="btn btn-primary">Registrarse</button>
                                        </div>
                                    </fieldset>
                                )}
                            </form>

                            <div className="mt-4 text-center">
                                <span className="text-sm">
                                    ¿Ya tienes una cuenta?{" "}
                                    <Link to="/login" className="link link-hover text-primary">
                                        Inicia sesión
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
