import React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useGetData } from '../../../shared/hooks/useApi'

export default function AvailableFligths() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract filters from URL params
  const filters = {
    departure_airport: searchParams.get('departure_airport'),
    arrival_airport: searchParams.get('arrival_airport'),
    date: searchParams.get('date'),
    passengers: searchParams.get('passengers')
  };

  // Build query string for API call
  const queryParams = new URLSearchParams();
  if (filters.departure_airport) queryParams.append('departure_airport', filters.departure_airport);
  if (filters.arrival_airport) queryParams.append('arrival_airport', filters.arrival_airport);
  if (filters.date) queryParams.append('date', filters.date);

  const { data: flights, loading } = useGetData(`flights/available?${queryParams.toString()}`);

  const availableFlights = flights?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Vuelos Disponibles</h1>

      {/* Display current filters */}
      <div className="mb-6 p-4 bg-base-200 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Filtros aplicados:</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          {filters.departure_airport && (
            <span className="badge badge-primary">Origen: {filters.departure_airport}</span>
          )}
          {filters.arrival_airport && (
            <span className="badge badge-primary">Destino: {filters.arrival_airport}</span>
          )}
          {filters.date && (
            <span className="badge badge-primary">Fecha: {filters.date}</span>
          )}
          {filters.passengers && (
            <span className="badge badge-primary">Pasajeros: {filters.passengers}</span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      ) : availableFlights.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✈️</div>
          <h2 className="text-2xl font-bold mb-2">No encontramos vuelos para ti</h2>
          <p className="text-gray-600 mb-4">
            No hay vuelos disponibles con los criterios seleccionados.
            Intenta cambiar las fechas o destinos.
          </p>
          <button
            onClick={() => window.history.back()}
            className="btn btn-primary"
          >
            Buscar otros vuelos
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {availableFlights.map((flight) => (
            <div key={flight.id} className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="card-title">
                      {flight.departure_airport} → {flight.arrival_airport}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Fecha: {flight.date} | Salida: {flight.dep_time} | Llegada: {flight.arr_time}
                    </p>
                    <p className="text-sm">
                      Asientos disponibles: {flight.available_seats} de {flight.total_seats}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      ${flight.price?.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">por persona</p>
                    <button
                      className="btn btn-primary btn-sm mt-2"
                      onClick={() => navigate('/passengers/add', {
                        state: {
                          flight,
                          passengers: parseInt(filters.passengers) || 1
                        }
                      })}
                    >
                      Reservar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
