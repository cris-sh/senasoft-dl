import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchApiData } from '../../../shared/hooks/useApi'

export default function Payment() {
  const location = useLocation()
  const navigate = useNavigate()
  const { flight, passengers, totalPrice, bookingId } = location.state || {}
  const [paymentMethod, setPaymentMethod] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  if (!flight || !passengers || !totalPrice) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <span>No se encontró información del pago. Por favor, inicie el proceso nuevamente.</span>
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

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert('Por favor selecciona un método de pago')
      return
    }

    setIsProcessing(true)

    try {
      // Preparar datos de pago
      const paymentData = {
        booking_id: bookingId,
        payment_data: {
          pay_method: paymentMethod,
          name: passengers[0]?.names + ' ' + passengers[0]?.lastname,
          doc_type: passengers[0]?.doc_type,
          num_doc: passengers[0]?.doc_num,
          email: passengers[0]?.email,
          phone: passengers[0]?.phone
        }
      }

      const response = await postData('bookings/confirm', paymentData)

      if (response) {
        navigate('/booking/invoice', {
          state: {
            flight,
            passengers,
            totalPrice,
            paymentMethod,
            bookingId: response.data.booking.id,
            invoiceId: response.data.invoice.id
          }
        })
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      alert('Error al procesar el pago. Por favor, inténtelo nuevamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Pago de Reserva</h1>

        {/* Order Summary */}
        <div className="card bg-base-100 shadow-lg mb-6">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Resumen de la Orden</h2>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Vuelo:</span>
                <span>{flight.departure_airport} → {flight.arrival_airport}</span>
              </div>
              <div className="flex justify-between">
                <span>Fecha:</span>
                <span>{flight.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Pasajeros:</span>
                <span>{passengers.length}</span>
              </div>
              <div className="divider"></div>
              <div className="flex justify-between text-xl font-bold">
                <span>Total a pagar:</span>
                <span className="text-primary">${totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="card bg-base-100 shadow-lg mb-6">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Método de Pago</h2>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      className="radio radio-primary mr-3"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Tarjeta de Crédito
                  </span>
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="debit_card"
                      className="radio radio-primary mr-3"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Tarjeta de Débito
                  </span>
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      className="radio radio-primary mr-3"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Transferencia Bancaria
                  </span>
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      className="radio radio-primary mr-3"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Efectivo
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/booking/confirmation', {
              state: { flight, passengers, totalPrice }
            })}
            className="btn btn-outline"
            disabled={isProcessing}
          >
            ← Volver
          </button>
          <button
            onClick={handlePayment}
            className={`btn btn-primary btn-lg ${isProcessing ? 'loading' : ''}`}
            disabled={isProcessing}
          >
            {isProcessing ? 'Procesando...' : `Pagar $${totalPrice.toLocaleString()}`}
          </button>
        </div>

        {isProcessing && (
          <div className="text-center mt-4">
            <div className="alert alert-info">
              <span>Procesando el pago, por favor espera...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}