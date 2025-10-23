import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlaneTakeoff, PlaneLanding, Calendar, UserPlus } from "lucide-react";
import DestionationCard from "../../modules/destinations/components/DestionationCard";
import { useGetData } from "../hooks/useApi";

export default function Home() {
    const navigate = useNavigate();
    const [trip, setTrip] = useState("roundtrip");
    const [formData, setFormData] = useState({
        origin: "",
        destination: "",
        departureDate: "",
        returnDate: "",
        passengers: "1"
    });

    const { data: airports, loading: loadingAirports} = useGetData('airports');

    useEffect(()=> {
        console.log(airports);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Build query parameters
        const params = new URLSearchParams();
        if (formData.origin) params.append('departure_airport', formData.origin);
        if (formData.destination) params.append('arrival_airport', formData.destination);
        if (formData.departureDate) params.append('date', formData.departureDate);
        if (formData.passengers) params.append('passengers', formData.passengers);

        // Navigate to available flights page with filters
        navigate(`/flights/available?${params.toString()}`);
    };

    const destinations = [
        {
            title: "Medellín",
            subtitle: "La capital mundial del Reggeton",
            price: "Desde $200.000",
            image: "/images/medellin.jpg",
            badge: "Popular",
        },
        {
            title: "Parque Jaime Duque",
            subtitle: "Atracción",
            price: "$56.000",
            image: "/images/jaime-duque.jpg",
        },
        {
            title: "Bogotá",
            subtitle: "La capital de Colombia",
            price: "Desde $150.000",
            image: "/images/bogota.jpg",
            badge: "Oferta",
        },
    ];

    return (
        <main className="min-h-screen bg-base-100 text-base-content">
            {/* HERO - full width */}
            <section className="w-full overflow-hidden bg-gradient-to-b from-black/60 to-black/10">
                <div className="h-[350px] sm:h-[420px] md:h-[480px] lg:h-[520px] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/hero.webp)' }}>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-20 pt-12 sm:pt-16 md:pt-20">
                        <div className="flex items-start justify-between">
                            <div className="max-w-2xl text-white">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-semibold leading-tight">
                                    Conoce hermosos lugares
                                </h1>
                                <p className="mt-3 text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-extrabold">
                                    Vuela desde <span className="text-purple-400">$100.000</span>
                                </p>
                                <div className="mt-6">
                                    <button className="btn btn-primary btn-md py-3 px-5 text-white font-semibold flex items-center justify-between gap-3">
                                        <span>Agenda ahora</span>
                                        <PlaneTakeoff className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEARCH CARD - positioned below hero */}
            <section className="w-full px-4 sm:px-6 -mt-12 sm:-mt-16 relative z-10">
                <div className="mx-auto bg-base-300 rounded-xl shadow-2xl ring-1 ring-black/5 max-w-6xl overflow-visible">
                    <div className="p-4 md:p-6 lg:p-8">
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold">¿A dónde vas?</h3>
                            <div className="mt-3 flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="trip"
                                        className="radio radio-primary"
                                        value="roundtrip"
                                        checked={trip === "roundtrip"}
                                        onChange={() => setTrip("roundtrip")}
                                    />
                                    <span className="text-sm">Ida y vuelta</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="trip"
                                        className="radio"
                                        value="oneway"
                                        checked={trip === "oneway"}
                                        onChange={() => setTrip("oneway")}
                                    />
                                    <span className="text-sm">Solo ida</span>
                                </label>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                            {/* From */}
                            {/* Origen / Destino box */}
                            <div
                                className={
                                    trip === "oneway"
                                        ? "md:col-span-7 lg:col-span-7"
                                        : "md:col-span-5 lg:col-span-5"
                                }
                            >
                                <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-3 h-14">
                                    <div className="flex-1 flex items-center gap-2">
                                        <PlaneTakeoff className="h-5 w-5 text-purple-600" />
                                        <select
                                            className="select select-ghost w-full"
                                            value={formData.origin}
                                            onChange={(e) => setFormData({...formData, origin: e.target.value})}
                                        >
                                            <option value="" disabled>
                                                Origen
                                            </option>
                                            {loadingAirports ? (
                                                <option disabled>Cargando...</option>
                                            ) : (
                                                airports?.data?.map((airport) => (
                                                    <option key={airport.id} value={airport.code}>
                                                        {airport.city} ({airport.code})
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                    </div>
                                    <div className="h-8 w-px bg-gray-300" />
                                    <div className="flex-1 flex items-center gap-2">
                                        <PlaneLanding className="h-5 w-5 text-purple-600" />
                                        <select
                                            className="select select-ghost w-full"
                                            value={formData.destination}
                                            onChange={(e) => setFormData({...formData, destination: e.target.value})}
                                        >
                                            <option value="" disabled>
                                                Destino
                                            </option>
                                            {loadingAirports ? (
                                                <option disabled>Cargando...</option>
                                            ) : (
                                                airports?.data?.map((airport) => (
                                                    <option key={airport.id} value={airport.code}>
                                                        {airport.city} ({airport.code})
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Dates box */}
                            <div
                                className={
                                    trip === "oneway"
                                        ? "md:col-span-3 lg:col-span-3"
                                        : "md:col-span-5 lg:col-span-5"
                                }
                            >
                                <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-3 h-14">
                                    <div className="flex-1 flex items-center gap-2">
                                        <div className="text-xs text-gray-500">Ida</div>
                                        <Calendar className="h-5 w-5 text-purple-600" />
                                        <input
                                            type="date"
                                            className="input input-ghost w-full"
                                            value={formData.departureDate}
                                            onChange={(e) => setFormData({...formData, departureDate: e.target.value})}
                                        />
                                    </div>
                                    {trip === "roundtrip" && (
                                        <>
                                            <div className="h-8 w-px bg-gray-300" />
                                            <div className="flex-1 flex items-center gap-2">
                                                <div className="text-xs text-gray-500">
                                                    Vuelta
                                                </div>
                                                <Calendar className="h-5 w-5 text-purple-600" />
                                                <input
                                                    type="date"
                                                    className="input input-ghost w-full"
                                                    value={formData.returnDate}
                                                    onChange={(e) => setFormData({...formData, returnDate: e.target.value})}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Passengers + Search */}
                            <div className="md:col-span-2 lg:col-span-2 flex items-center gap-3">
                                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 h-14 w-full">
                                    <UserPlus className="h-5 w-5 text-purple-600" />
                                    <select
                                        className="select select-ghost w-full"
                                        value={formData.passengers}
                                        onChange={(e) => setFormData({...formData, passengers: e.target.value})}
                                    >
                                        <option value="1">1 pasajero</option>
                                        <option value="2">2 pasajeros</option>
                                        <option value="3">3 pasajeros</option>
                                        <option value="4">4 pasajeros</option>
                                        <option value="5">5 pasajeros</option>
                                    </select>
                                </div>

                                <div className="w-12 h-12">
                                    <button
                                        type="submit"
                                        className="w-12 h-12 bg-purple-700 hover:bg-purple-800 text-white rounded-lg flex items-center justify-center"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.386a1 1 0 01-1.414 1.415l-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* Destinations */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-20 mt-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">DESTINO PARA TI HOY EN COLOMBIA</h2>
                    <button className="btn btn-ghost btn-sm">Ver todos</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {destinations.map((d) => (
                        <DestionationCard key={d.title} {...d} />
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <button className="btn btn-outline">Mira todos los destinos</button>
                </div>
            </section>
        </main>
    );
}
