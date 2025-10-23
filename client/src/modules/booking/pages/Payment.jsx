import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Payment() {
  const location = useLocation()
  const navigate = useNavigate()
  const { flight, passengers, totalPrice, bookingId } = location.state || {}
  const [paymentMethod, setPaymentMethod] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

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

    if (!termsAccepted) {
      alert('Por favor acepta los términos y condiciones antes de proceder con el pago')
      return
    }

    setIsProcessing(true)

    try {
      // Simular procesamiento de pago sin llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simular delay de 2 segundos

      // Generar ID de factura simulado
      const simulatedInvoiceId = `INV-${Date.now()}-${Math.floor(Math.random() * 10000)}`

      // Navegar a la página de factura
      navigate('/booking/invoice', {
        state: {
          flight,
          passengers,
          totalPrice,
          paymentMethod,
          bookingId,
          invoiceId: simulatedInvoiceId
        }
      })
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

        {/* Terms and Conditions */}
        <div className="card bg-base-100 shadow-lg mb-6">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Términos y Condiciones</h2>

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text flex items-center">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary mr-3"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  Acepto los términos y condiciones del servicio
                </span>
              </label>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p>
                Al aceptar, confirmo que he leído y acepto los términos y condiciones de la aerolínea,
                incluyendo las políticas de cancelación, cambios y reembolsos.
              </p>
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
            disabled={isProcessing || !termsAccepted}
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