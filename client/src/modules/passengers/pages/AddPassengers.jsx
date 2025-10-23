import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGetData } from '../../../shared/hooks/useApi'

export default function AddPassengers() {
  const location = useLocation()
  const navigate = useNavigate()
  const { flight, passengers: passengerCount } = location.state || {}

  const [passengers, setPassengers] = useState(
    Array.from({ length: passengerCount || 1 }, () => ({
      names: '',
      lastname: '',
      doc_type: '',
      doc_num: '',
      birthday: '',
      gender: '',
      phone: '',
      email: '',
      is_child: false,
      seat_id: null,
      seat_number: ''
    }))
  )

  const [selectedSeats, setSelectedSeats] = useState(new Set())
  const { data: seatsData, loading: seatsLoading } = useGetData(flight ? `seats/plane/${flight.plane_id}` : null)
  const availableSeats = seatsData?.data || []

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers]
    updatedPassengers[index][field] = value
    setPassengers(updatedPassengers)
  }

  const handleSeatSelection = (passengerIndex, seat) => {
    const updatedPassengers = [...passengers]
    const currentSeatId = updatedPassengers[passengerIndex].seat_id

    // Liberar asiento anterior si existe
    if (currentSeatId) {
      setSelectedSeats(prev => {
        const newSet = new Set(prev)
        newSet.delete(currentSeatId)
        return newSet
      })
    }

    // Asignar nuevo asiento
    updatedPassengers[passengerIndex].seat_id = seat.id
    updatedPassengers[passengerIndex].seat_number = seat.seat_number

    setSelectedSeats(prev => new Set([...prev, seat.id]))
    setPassengers(updatedPassengers)
  }

  const calculateTotalPrice = () => {
    return passengers.reduce((total, passenger) => {
      const basePrice = parseFloat(flight?.price || 0)
      const seatPrice = passenger.seat_id
        ? parseFloat(availableSeats.find(seat => seat.id === passenger.seat_id)?.add_price || 0)
        : 0
      return total + basePrice + seatPrice
    }, 0)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la lógica para guardar los pasajeros
    console.log('Flight:', flight)
    console.log('Passengers:', passengers)
    // navigate('/booking/confirm', { state: { flight, passengers } })
  }

  if (!flight) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <span>No se encontró información del vuelo. Por favor, selecciona un vuelo primero.</span>
        </div>
        <button
          onClick={() => navigate('/flights/available')}
          className="btn btn-primary mt-4"
        >
          Volver a vuelos disponibles
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Información de Pasajeros</h1>

      {/* Flight Summary */}
      <div className="card bg-base-100 shadow-lg mb-6">
        <div className="card-body">
          <h2 className="card-title">Vuelo Seleccionado</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">
                {flight.departure_airport} → {flight.arrival_airport}
              </p>
              <p className="text-sm text-gray-600">
                Fecha: {flight.date} | Salida: {flight.dep_time} | Llegada: {flight.arr_time}
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {passengers.map((passenger, index) => (
          <div key={index} className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">Pasajero {index + 1}</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Passenger Information - Left Side */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Nombres *</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={passenger.names}
                        onChange={(e) => handlePassengerChange(index, 'names', e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Apellidos *</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={passenger.lastname}
                        onChange={(e) => handlePassengerChange(index, 'lastname', e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Tipo de Documento *</span>
                      </label>
                      <select
                        className="select select-bordered"
                        value={passenger.doc_type}
                        onChange={(e) => handlePassengerChange(index, 'doc_type', e.target.value)}
                        required
                      >
                        <option value="">Seleccionar...</option>
                        <option value="CC">Cédula de Ciudadanía</option>
                        <option value="CE">Cédula de Extranjería</option>
                        <option value="TI">Tarjeta de Identidad</option>
                        <option value="PP">Pasaporte</option>
                      </select>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Número de Documento *</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={passenger.doc_num}
                        onChange={(e) => handlePassengerChange(index, 'doc_num', e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Fecha de Nacimiento *</span>
                      </label>
                      <input
                        type="date"
                        className="input input-bordered"
                        value={passenger.birthday}
                        onChange={(e) => handlePassengerChange(index, 'birthday', e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Género *</span>
                      </label>
                      <select
                        className="select select-bordered"
                        value={passenger.gender}
                        onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                        required
                      >
                        <option value="">Seleccionar...</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                        <option value="O">Otro</option>
                      </select>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Teléfono</span>
                      </label>
                      <input
                        type="tel"
                        className="input input-bordered"
                        value={passenger.phone}
                        onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)}
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Correo Electrónico</span>
                      </label>
                      <input
                        type="email"
                        className="input input-bordered"
                        value={passenger.email}
                        onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                      />
                    </div>

                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">¿Es niño?</span>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          checked={passenger.is_child}
                          onChange={(e) => handlePassengerChange(index, 'is_child', e.target.checked)}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Seat Selection - Right Side */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Selección de Asiento</h4>

                  {seatsLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="loading loading-spinner loading-lg"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border border-base-300 rounded-lg p-4 max-h-80 overflow-y-auto">
                        <div className="grid grid-cols-8 gap-1">
                          {availableSeats.map((seat) => {
                            const isSelected = selectedSeats.has(seat.id)
                            const isCurrentPassengerSeat = passenger.seat_id === seat.id
                            const isOccupied = isSelected && !isCurrentPassengerSeat

                            return (
                              <button
                                key={seat.id}
                                type="button"
                                className={`btn btn-xs ${
                                  isCurrentPassengerSeat
                                    ? 'btn-primary'
                                    : isOccupied
                                    ? 'btn-disabled'
                                    : 'btn-outline'
                                }`}
                                onClick={() => handleSeatSelection(index, seat)}
                                disabled={isOccupied}
                              >
                                {seat.seat_number}
                                {seat.add_price > 0 && (
                                  <span className="text-xs block leading-none">
                                    +${seat.add_price}
                                  </span>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {passenger.seat_number && (
                        <div className="alert alert-success">
                          <span>
                            Asiento seleccionado: <strong>{passenger.seat_number}</strong>
                            {(() => {
                              const seat = availableSeats.find(s => s.id === passenger.seat_id)
                              const extraPrice = seat?.add_price || 0
                              return extraPrice > 0 ? ` (+$${extraPrice})` : ''
                            })()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Price Summary */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">Resumen del Precio</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Precio base por pasajero:</span>
                <span>${flight?.price?.toLocaleString()}</span>
              </div>
              {passengers.map((passenger, index) => {
                const seat = availableSeats.find(s => s.id === passenger.seat_id)
                const extraPrice = seat?.add_price || 0
                return extraPrice > 0 ? (
                  <div key={index} className="flex justify-between text-sm">
                    <span>Asiento {passenger.seat_number} (Pasajero {index + 1}):</span>
                    <span>+${extraPrice}</span>
                  </div>
                ) : null
              })}
              <div className="divider"></div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">${calculateTotalPrice().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate('/flights/available')}
            className="btn btn-outline"
          >
            ← Volver
          </button>
          <button type="submit" className="btn btn-primary">
            Continuar con la Reserva
          </button>
        </div>
      </form>
    </div>
  )
}
