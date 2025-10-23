# API Endpoints - AirFly Sistema de Reservas Aéreas

## Descripción General

Este documento describe todos los endpoints implementados en la API REST de AirFly, un sistema de reservas aéreas. La API está construida con Node.js, Express.js y Sequelize, utilizando PostgreSQL como base de datos.

## Autenticación

Todos los endpoints requieren autenticación JWT excepto los marcados como públicos. Para obtener un token JWT, use el endpoint de login.

### Headers Requeridos
```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

## Endpoints Implementados

### 1. Autenticación (`/api/auth`)

#### POST `/api/auth/register`
Registra un nuevo usuario en el sistema.

**Cuerpo de la solicitud:**
```json
{
  "name": "string",
  "lastname": "string",
  "snd_lastname": "string",
  "email": "string",
  "password": "string",
  "phone": "string",
  "birthday": "YYYY-MM-DD",
  "gender": "male|female",
  "doc_type": "CC|TI|CE",
  "doc_num": "string"
}
```

**Respuesta exitosa (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {...},
    "token": "jwt_token"
  },
  "status": 201
}
```

#### POST `/api/auth/login`
Inicia sesión y obtiene token JWT.

**Cuerpo de la solicitud:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Respuesta exitosa (200):**
```json
{
  "message": "ok",
  "data": {
    "user": {...},
    "token": "jwt_token"
  },
  "status": 200
}
```

#### GET `/api/auth/me`
Obtiene información del usuario autenticado.

**Respuesta exitosa (200):**
```json
{
  "message": "ok",
  "data": {
    "user": {...},
    "preferences": {...}
  },
  "status": 200
}
```

### 2. Preferencias (`/api/preferences`)

#### GET `/api/preferences`
Obtiene las preferencias del usuario autenticado.

#### PUT `/api/preferences`
Actualiza las preferencias del usuario.

**Cuerpo de la solicitud:**
```json
{
  "theme": "dark|light"
}
```

### 3. Pasajeros (`/api/passengers`)

#### GET `/api/passengers`
Lista todos los pasajeros (requiere autenticación).

#### GET `/api/passengers/:id`
Obtiene un pasajero específico por ID.

#### POST `/api/passengers`
Crea un nuevo pasajero (requiere autenticación).

**Cuerpo de la solicitud:**
```json
{
  "names": "string",
  "lastname": "string",
  "snd_lastname": "string",
  "birthday": "YYYY-MM-DD",
  "gender": "male|female",
  "doc_type": "CC|TI|CE",
  "doc_num": "string|number",
  "phone": "string",
  "email": "string",
  "user_id": "number"
}
```

#### PUT `/api/passengers/:id`
Actualiza un pasajero existente.

#### DELETE `/api/passengers/:id`
Elimina un pasajero.

### 4. Vuelos (`/api/flights`)

#### GET `/api/flights`
Lista todos los vuelos disponibles.

**Respuesta exitosa (200):**
```json
{
  "message": "ok",
  "data": {
    "data": [
      {
        "id": "number",
        "plane_id": "number",
        "departure_airport": "number",
        "arrival_airport": "number",
        "dep_time": "datetime",
        "arr_time": "datetime",
        "date": "date",
        "price": "decimal",
        "type": "ida|vuelta"
      }
    ]
  },
  "status": 200
}
```

#### GET `/api/flights/available`
Obtiene vuelos disponibles con filtros opcionales.

**Parámetros de consulta:**
- `departure_city`: Ciudad de salida
- `arrival_city`: Ciudad de llegada
- `date`: Fecha del vuelo (YYYY-MM-DD)

**Ejemplo:** `/api/flights/available?departure_city=bogota&arrival_city=medellin`

**Respuesta exitosa (200):**
```json
{
  "message": "ok",
  "data": {
    "data": [
      {
        "id": "number",
        "plane_id": "number",
        "departure_airport": "number",
        "arrival_airport": "number",
        "dep_time": "datetime",
        "arr_time": "datetime",
        "date": "date",
        "price": "decimal",
        "available_seats": "number",
        "total_seats": "number"
      }
    ]
  },
  "status": 200
}
```

#### GET `/api/flights/:id`
Obtiene detalles de un vuelo específico.

#### POST `/api/flights`
Crea un nuevo vuelo (requiere autenticación).

**Cuerpo de la solicitud:**
```json
{
  "plane_id": "number",
  "departure": "number",
  "arrival": "number",
  "dep_time": "datetime",
  "arr_time": "datetime",
  "date": "date",
  "price": "decimal"
}
```

#### PUT `/api/flights/:id`
Actualiza un vuelo existente.

#### DELETE `/api/flights/:id`
Elimina un vuelo.

### 5. Reservas (`/api/booking`)

#### GET `/api/booking`
Lista las reservas del usuario autenticado.

#### GET `/api/booking/:id`
Obtiene detalles de una reserva específica.

#### POST `/api/booking`
Crea una nueva reserva con pasajeros y asientos.

**Cuerpo de la solicitud:**
```json
{
  "flight_id": "number",
  "passengers": [
    {
      "names": "string",
      "lastname": "string",
      "snd_lastname": "string",
      "birthday": "YYYY-MM-DD",
      "gender": "male|female",
      "doc_type": "CC|TI|CE",
      "doc_num": "string|number",
      "phone": "string",
      "email": "string",
      "seat_id": "number"
    }
  ]
}
```

**Respuesta exitosa (201):**
```json
{
  "message": "Reserva creada exitosamente",
  "data": {
    "booking": {...},
    "passengers": [...],
    "seats": [...]
  },
  "status": 201
}
```

#### POST `/api/booking/confirm`
Confirma una reserva y procesa el pago.

**Cuerpo de la solicitud:**
```json
{
  "booking_id": "number",
  "payment_data": {
    "name": "string",
    "doc_type": "string",
    "num_doc": "string",
    "email": "string",
    "phone": "string",
    "pay_method": "credit_card|debit_card|bank_transfer|cash"
  }
}
```

#### DELETE `/api/booking/:id`
Elimina una reserva.

### 6. Tickets (`/api/ticket`)

#### GET `/api/ticket`
Lista los tickets del usuario autenticado.

#### GET `/api/ticket/:id`
Obtiene detalles de un ticket específico.

#### POST `/api/ticket`
Crea un nuevo ticket (requiere autenticación).

### 7. Aeropuertos (`/api/airports`)

#### GET `/api/airports`
Lista todos los aeropuertos.

#### GET `/api/airports/:id`
Obtiene detalles de un aeropuerto específico.

#### POST `/api/airports`
Crea un nuevo aeropuerto (requiere autenticación).

#### PUT `/api/airports/:id`
Actualiza un aeropuerto existente.

#### DELETE `/api/airports/:id`
Elimina un aeropuerto.

### 8. Aviones (`/api/planes`)

#### GET `/api/planes`
Lista todos los aviones.

#### GET `/api/planes/:id`
Obtiene detalles de un avión específico.

#### POST `/api/planes`
Crea un nuevo avión (requiere autenticación).

**Cuerpo de la solicitud:**
```json
{
  "model": "string",
  "capacity": "number",
  "plate": "string",
  "status": "string"
}
```

#### PUT `/api/planes/:id`
Actualiza un avión existente.

#### DELETE `/api/planes/:id`
Elimina un avión.

### 9. Asientos (`/api/seats`)

#### GET `/api/seats`
Lista todos los asientos.

#### GET `/api/seats/:id`
Obtiene detalles de un asiento específico.

#### POST `/api/seats`
Crea un nuevo asiento (requiere autenticación).

**Cuerpo de la solicitud:**
```json
{
  "plane_id": "number",
  "code": "string",
  "type": "economy|business|first",
  "add_price": "decimal"
}
```

#### PUT `/api/seats/:id`
Actualiza un asiento existente.

#### DELETE `/api/seats/:id`
Elimina un asiento.

### 10. Facturas (`/api/invoice`)

#### GET `/api/invoice`
Lista todas las facturas (requiere autenticación).

#### GET `/api/invoice/:id`
Obtiene detalles de una factura específica.

#### POST `/api/invoice`
Crea una nueva factura (requiere autenticación).

## Códigos de Estado HTTP

- `200`: OK - Operación exitosa
- `201`: Created - Recurso creado exitosamente
- `204`: No Content - Operación exitosa sin contenido de respuesta
- `400`: Bad Request - Datos inválidos en la solicitud
- `401`: Unauthorized - Autenticación requerida
- `404`: Not Found - Recurso no encontrado
- `409`: Conflict - Conflicto en la operación (ej: asiento ocupado)
- `500`: Internal Server Error - Error interno del servidor

## Validaciones

La API utiliza Joi para validar los datos de entrada. Los errores de validación se devuelven con código 400 y un mensaje descriptivo.

## Transacciones

Las operaciones críticas como creación de reservas se ejecutan dentro de transacciones de base de datos para garantizar la integridad de los datos.

## Arquitectura

### Modelos (Sequelize)
- `User`: Usuarios del sistema
- `Passenger`: Pasajeros asociados a reservas
- `Flight`: Vuelos disponibles
- `Booking`: Reservas realizadas
- `BookingSeat`: Asientos asignados en reservas
- `Ticket`: Tickets generados
- `Invoice`: Facturas de pago
- `Airport`: Aeropuertos
- `Plane`: Aviones
- `Seat`: Asientos disponibles en aviones

### Servicios
- `bookingService`: Lógica de negocio para reservas y pagos
- `auth`: Autenticación JWT
- `validators`: Validaciones con Joi

### Middlewares
- `authJwt`: Verificación de tokens JWT
- `errorHandler`: Manejo global de errores

## Base de Datos

La aplicación utiliza PostgreSQL con las siguientes tablas principales:
- `users`
- `passengers`
- `flights`
- `bookings`
- `booking_seats`
- `tickets`
- `invoices`
- `airports`
- `planes`
- `seats`
- `preferences`

## Consideraciones de Seguridad

- Todas las contraseñas se hashean con bcrypt
- Los tokens JWT tienen expiración
- Validación de entrada en todos los endpoints
- Protección contra inyección SQL mediante Sequelize ORM

## Próximos Pasos

- Implementar notificaciones por email
- Agregar sistema de check-in
- Implementar cancelaciones de reservas
- Agregar filtros avanzados de búsqueda
- Implementar sistema de promociones y descuentos