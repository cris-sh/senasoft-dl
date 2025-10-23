import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function BookingConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { flight, passengers, totalPrice } = location.state || {}

  if (!flight || !passengers) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <span>No se encontró información de la reserva. Por favor, inicie el proceso nuevamente.</span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="btn btn-primary mt-4"
        >
          Volver al inicio
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Confirmación de Reserva</h1>

        {/* Flight Details */}
        <div className="card bg-base-100 shadow-lg mb-6">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Detalles del Vuelo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-lg font-semibold">
                  {flight.departure_airport} → {flight.arrival_airport}
                </p>
                <p className="text-sm text-gray-600">
                  Fecha: {flight.date}
                </p>
                <p className="text-sm text-gray-600">
                  Salida: {flight.dep_time} | Llegada: {flight.arr_time}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  ${flight.price?.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">por persona</p>
              </div>
            </div>
          </div>
        </div>

        {/* Passengers Details */}
        <div className="card bg-base-100 shadow-lg mb-6">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Pasajeros ({passengers.length})</h2>
            <div className="space-y-4">
              {passengers.map((passenger, index) => (
                <div key={index} className="border border-base-300 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">
                        {passenger.names} {passenger.lastname}
                        {passenger.is_child && (
                          <span className="badge badge-info ml-2">Niño</span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {passenger.doc_type}: {passenger.doc_num}
                      </p>
                      <p className="text-sm text-gray-600">
                        Asiento: {passenger.seat_number}
                      </p>
                      {passenger.email && (
                        <p className="text-sm text-gray-600">
                          Email: {passenger.email}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${(() => {
                          const basePrice = parseFloat(flight.price || 0)
                          return basePrice.toLocaleString()
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="card bg-base-100 shadow-lg mb-6">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Resumen de Precios</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Precio base ({passengers.length} pasajero{passengers.length > 1 ? 's' : ''}):</span>
                <span>${(parseFloat(flight.price || 0) * passengers.length).toLocaleString()}</span>
              </div>
              {passengers.some(p => p.seat_id) && (
                <div className="flex justify-between">
                  <span>Cargos adicionales por asientos:</span>
                  <span>${(() => {
                    const extraTotal = passengers.reduce((total, passenger) => {
                      // Aquí necesitaríamos acceder al precio adicional del asiento
                      // Por ahora asumimos que viene en el objeto passenger
                      return total + (passenger.seat_extra_price || 0)
                    }, 0)
                    return extraTotal.toLocaleString()
                  })()}</span>
                </div>
              )}
              <div className="divider"></div>
              <div className="flex justify-between text-xl font-bold">
                <span>Total a pagar:</span>
                <span className="text-primary">${totalPrice?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/passengers/add', { state: { flight, passengers: passengers.length } })}
            className="btn btn-outline"
          >
            ← Modificar Reserva
          </button>
          <button
            onClick={() => navigate('/booking/payment', {
              state: { flight, passengers, totalPrice }
            })}
            className="btn btn-primary btn-lg"
          >
            Proceder al Pago
          </button>
        </div>
      </div>
    </div>
  )
}