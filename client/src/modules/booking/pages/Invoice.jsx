import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Invoice() {
  const location = useLocation()
  const navigate = useNavigate()
  const { flight, passengers, totalPrice, paymentMethod, bookingId, invoiceId } = location.state || {}

  if (!flight || !passengers || !totalPrice) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <span>No se encontró información de la factura. Por favor, contacta al soporte.</span>
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

  const currentDate = new Date().toLocaleDateString('es-CO')
  const paymentMethodNames = {
    credit_card: 'Tarjeta de Crédito',
    debit_card: 'Tarjeta de Débito',
    bank_transfer: 'Transferencia Bancaria',
    cash: 'Efectivo'
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Aquí iría la lógica para descargar el PDF
    alert('Funcionalidad de descarga próximamente disponible')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Factura Electrónica</h1>
          <p className="text-lg text-gray-600">Aerolínea SenaSoft</p>
        </div>

        {/* Invoice Details */}
        <div className="card bg-base-100 shadow-lg mb-6">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-bold text-lg mb-2">Información de la Factura</h3>
                <p><strong>Número de Factura:</strong> {invoiceId}</p>
                <p><strong>Fecha de Emisión:</strong> {currentDate}</p>
                <p><strong>ID de Reserva:</strong> {bookingId}</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Información del Cliente</h3>
                <p><strong>Nombre:</strong> {passengers[0]?.names} {passengers[0]?.lastname}</p>
                <p><strong>Documento:</strong> {passengers[0]?.doc_type} {passengers[0]?.doc_num}</p>
                <p><strong>Email:</strong> {passengers[0]?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Flight Details */}
        <div className="card bg-base-100 shadow-lg mb-6">
          <div className="card-body">
            <h3 className="card-title text-xl mb-4">Detalles del Servicio</h3>

            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div>
                        <p className="font-semibold">Vuelo {flight.departure_airport} → {flight.arrival_airport}</p>
                        <p className="text-sm text-gray-600">Fecha: {flight.date}</p>
                        <p className="text-sm text-gray-600">Horario: {flight.dep_time} - {flight.arr_time}</p>
                      </div>
                    </td>
                    <td>{passengers.length}</td>
                    <td>${flight.price?.toLocaleString()}</td>
                    <td>${(parseFloat(flight.price || 0) * passengers.length).toLocaleString()}</td>
                  </tr>

                  {/* Seat extras */}
                  {passengers.map((passenger, index) => {
                    if (passenger.seat_id) {
                      // Aquí necesitaríamos el precio adicional del asiento
                      const seatExtraPrice = passenger.seat_extra_price || 0
                      if (seatExtraPrice > 0) {
                        return (
                          <tr key={`seat-${index}`}>
                            <td>
                              <div>
                                <p className="text-sm">Asiento adicional - {passenger.seat_number}</p>
                                <p className="text-xs text-gray-600">Pasajero: {passenger.names} {passenger.lastname}</p>
                              </div>
                            </td>
                            <td>1</td>
                            <td>${seatExtraPrice.toLocaleString()}</td>
                            <td>${seatExtraPrice.toLocaleString()}</td>
                          </tr>
                        )
                      }
                    }
                    return null
                  })}
                </tbody>
                <tfoot>
                  <tr className="font-bold">
                    <td colSpan="3" className="text-right">Total a Pagar:</td>
                    <td className="text-primary">${totalPrice.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Passengers List */}
        <div className="card bg-base-100 shadow-lg mb-6">
          <div className="card-body">
            <h3 className="card-title text-xl mb-4">Pasajeros</h3>
            <div className="space-y-3">
              {passengers.map((passenger, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                  <div>
                    <p className="font-semibold">
                      {passenger.names} {passenger.lastname}
                      {passenger.is_child && (
                        <span className="badge badge-info ml-2">Niño</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">
                      {passenger.doc_type}: {passenger.doc_num}
                    </p>
                    <p className="text-sm text-gray-600">
                      Asiento: {passenger.seat_number}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${flight.price?.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="card bg-base-100 shadow-lg mb-6">
          <div className="card-body">
            <h3 className="card-title text-xl mb-4">Información de Pago</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Método de Pago:</strong> {paymentMethodNames[paymentMethod]}</p>
                <p><strong>Estado:</strong> <span className="text-success font-semibold">Pagado</span></p>
              </div>
              <div>
                <p><strong>Fecha de Pago:</strong> {currentDate}</p>
                <p><strong>Monto Total:</strong> ${totalPrice.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-600 mb-4">
            Gracias por elegir nuestros servicios. Esta factura es un comprobante oficial de su transacción.
          </p>
          <p className="text-xs text-gray-500">
            Aerolínea SenaSoft - Todos los derechos reservados © {new Date().getFullYear()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={handlePrint}
            className="btn btn-outline"
          >
            🖨️ Imprimir
          </button>
          <button
            onClick={handleDownload}
            className="btn btn-outline"
          >
            📥 Descargar PDF
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  )
}