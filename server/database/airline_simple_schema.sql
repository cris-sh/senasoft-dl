-- =========================================
-- ✈️ Simple Airline Database for Supabase / PostgreSQL
-- Includes: schema, trigger, and test data
-- =========================================

-- ======= USERS =======
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    lastname VARCHAR NOT NULL,
    snd_lastname VARCHAR,
    email VARCHAR NOT NULL UNIQUE, 
    password VARCHAR NOT NULL,
    birthday DATE NOT NULL,
    gender VARCHAR NOT NULL,
    doc_type VARCHAR NOT NULL,
    doc_num VARCHAR NOT NULL,
    phone VARCHAR NOT NULL,
    role VARCHAR NOT NULL DEFAULT 'user',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ======= PREFERENCES =======
CREATE TABLE preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    theme VARCHAR DEFAULT 'dark'
);



-- ======= AIRPORTS =======
CREATE TABLE airports (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    city VARCHAR NOT NULL,
    code VARCHAR NOT NULL UNIQUE
);

-- ======= PLANES =======
CREATE TABLE planes (
    id BIGSERIAL PRIMARY KEY,
    model VARCHAR NOT NULL,
    capacity SMALLINT NOT NULL,
    plate VARCHAR NOT NULL UNIQUE,
    status VARCHAR DEFAULT 'active'
);

-- ======= FLIGHTS =======
CREATE TABLE flights (
    id BIGSERIAL PRIMARY KEY,
    plane_id BIGINT REFERENCES planes(id),
    departure_airport BIGINT REFERENCES airports(id),
    arrival_airport BIGINT REFERENCES airports(id),
    dep_time TIMESTAMP NOT NULL,
    arr_time TIMESTAMP NOT NULL,
    type VARCHAR DEFAULT 'ida', -- ida o regreso
    price NUMERIC NOT NULL,
    date DATE NOT NULL,
    CHECK (dep_time < arr_time)
);

-- ======= SEATS =======
CREATE TABLE seats (
    id BIGSERIAL PRIMARY KEY,
    plane_id BIGINT REFERENCES planes(id),
    seat_number VARCHAR NOT NULL,
    class VARCHAR DEFAULT 'economy',
    add_price NUMERIC DEFAULT 0,
    UNIQUE (plane_id, seat_number)
);

-- ======= PASSENGERS =======
CREATE TABLE passengers (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    names VARCHAR NOT NULL,
    lastname VARCHAR NOT NULL,
    doc_type VARCHAR NOT NULL,
    doc_num VARCHAR NOT NULL,
    birthday DATE,
    gender VARCHAR,
    phone VARCHAR,
    email VARCHAR,
    child BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT now()
);

-- ======= BOOKINGS =======
CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    flight_id BIGINT REFERENCES flights(id),
    status VARCHAR DEFAULT 'reserved',
    created_at TIMESTAMP DEFAULT now(),
    CHECK (status IN ('reserved', 'paid', 'cancelled'))
);

-- ======= BOOKING_SEATS =======
CREATE TABLE booking_seats (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT REFERENCES bookings(id),
    passenger_id BIGINT REFERENCES passengers(id),
    seat_number VARCHAR NOT NULL,
    checkin BOOLEAN DEFAULT false,
    UNIQUE (booking_id, seat_number)
);

-- ======= TICKETS =======
CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,
    booking_seat_id BIGINT REFERENCES booking_seats(id),
    ticket_code VARCHAR UNIQUE NOT NULL,
    issued_at TIMESTAMP DEFAULT now()
);

-- ======= INVOICES =======
CREATE TABLE invoices (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT REFERENCES bookings(id),
    user_id BIGINT REFERENCES users(id),
    amount NUMERIC NOT NULL,
    pay_method VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT now()
);

-- ======= TRIGGER FUNCTION =======
CREATE OR REPLACE FUNCTION limit_passengers_per_user()
RETURNS TRIGGER AS $$
DECLARE
    existing_count INT;
BEGIN
    SELECT COUNT(*) INTO existing_count
    FROM bookings
    WHERE user_id = NEW.user_id
      AND flight_id = NEW.flight_id;

    IF existing_count >= 5 THEN
        RAISE EXCEPTION 'Un usuario no puede registrar más de 5 pasajeros en el mismo vuelo.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_limit_passengers
BEFORE INSERT ON bookings
FOR EACH ROW
EXECUTE FUNCTION limit_passengers_per_user();

-- ======= TEST DATA =======
-- User
INSERT INTO users (name, lastname, snd_lastname, email, password, birthday, gender, doc_type, doc_num, phone, role)
VALUES ('Juan', 'Pérez', '', 'juan@example.com', '123456', '1990-01-01', 'M', 'CC', '123', '3001234567', 'user');

-- Plane
INSERT INTO planes (model, capacity, plate)
VALUES ('Airbus A320', 180, 'ABC123');

-- Airports
INSERT INTO airports (name, city, code)
VALUES ('El Dorado', 'Bogotá', 'BOG'),
       ('José María Córdova', 'Medellín', 'MDE'),
       ('Matecaña', 'Pereira', 'PEI'),
       ('Ernesto Cortissoz', 'Barranquilla', 'BAQ'),
       ('Rafael Núñez', 'Cartagena', 'CTG'),
       ('Alfonso Bonilla Aragón', 'Cali', 'CLO');

-- Planes
INSERT INTO planes (model, capacity, plate)
VALUES ('Airbus A320', 180, 'ABC123'),
       ('Boeing 737-800', 189, 'DEF456'),
       ('Airbus A319', 156, 'GHI789'),
       ('Boeing 737-700', 149, 'JKL012');

-- Seats for Plane 1 (Airbus A320 - 180 seats)
INSERT INTO seats (plane_id, seat_number, class, add_price)
SELECT 1, 'A' || i::text, 'economy', 0
FROM generate_series(1, 30) i
UNION ALL
SELECT 1, 'B' || i::text, 'economy', 0
FROM generate_series(1, 30) i
UNION ALL
SELECT 1, 'C' || i::text, 'economy', 0
FROM generate_series(1, 30) i
UNION ALL
SELECT 1, 'D' || i::text, 'economy', 0
FROM generate_series(1, 30) i
UNION ALL
SELECT 1, 'E' || i::text, 'economy', 0
FROM generate_series(1, 30) i
UNION ALL
SELECT 1, 'F' || i::text, 'economy', 0
FROM generate_series(1, 30) i;

-- Seats for Plane 2 (Boeing 737-800 - 189 seats)
INSERT INTO seats (plane_id, seat_number, class, add_price)
SELECT 2, 'A' || i::text, 'economy', 0
FROM generate_series(1, 31) i
UNION ALL
SELECT 2, 'B' || i::text, 'economy', 0
FROM generate_series(1, 31) i
UNION ALL
SELECT 2, 'C' || i::text, 'economy', 0
FROM generate_series(1, 31) i
UNION ALL
SELECT 2, 'D' || i::text, 'economy', 0
FROM generate_series(1, 31) i
UNION ALL
SELECT 2, 'E' || i::text, 'economy', 0
FROM generate_series(1, 31) i
UNION ALL
SELECT 2, 'F' || i::text, 'economy', 0
FROM generate_series(1, 31) i;

-- Seats for Plane 3 (Airbus A319 - 156 seats)
INSERT INTO seats (plane_id, seat_number, class, add_price)
SELECT 3, 'A' || i::text, 'economy', 0
FROM generate_series(1, 26) i
UNION ALL
SELECT 3, 'B' || i::text, 'economy', 0
FROM generate_series(1, 26) i
UNION ALL
SELECT 3, 'C' || i::text, 'economy', 0
FROM generate_series(1, 26) i
UNION ALL
SELECT 3, 'D' || i::text, 'economy', 0
FROM generate_series(1, 26) i
UNION ALL
SELECT 3, 'E' || i::text, 'economy', 0
FROM generate_series(1, 26) i
UNION ALL
SELECT 3, 'F' || i::text, 'economy', 0
FROM generate_series(1, 26) i;

-- Seats for Plane 4 (Boeing 737-700 - 149 seats)
INSERT INTO seats (plane_id, seat_number, class, add_price)
SELECT 4, 'A' || i::text, 'economy', 0
FROM generate_series(1, 24) i
UNION ALL
SELECT 4, 'B' || i::text, 'economy', 0
FROM generate_series(1, 24) i
UNION ALL
SELECT 4, 'C' || i::text, 'economy', 0
FROM generate_series(1, 24) i
UNION ALL
SELECT 4, 'D' || i::text, 'economy', 0
FROM generate_series(1, 24) i
UNION ALL
SELECT 4, 'E' || i::text, 'economy', 0
FROM generate_series(1, 24) i
UNION ALL
SELECT 4, 'F' || i::text, 'economy', 0
FROM generate_series(1, 24) i;

-- Flights for today (2025-10-23) and tomorrow (2025-10-24)
-- Bogotá to Medellín
INSERT INTO flights (plane_id, departure_airport, arrival_airport, dep_time, arr_time, type, price, date)
VALUES (1, 1, 2, '2025-10-23 06:00:00', '2025-10-23 07:00:00', 'ida', 150000, '2025-10-23'),
       (1, 1, 2, '2025-10-23 08:00:00', '2025-10-23 09:00:00', 'ida', 150000, '2025-10-23'),
       (1, 1, 2, '2025-10-23 10:00:00', '2025-10-23 11:00:00', 'ida', 150000, '2025-10-23'),
       (1, 1, 2, '2025-10-23 12:00:00', '2025-10-23 13:00:00', 'ida', 150000, '2025-10-23'),
       (1, 1, 2, '2025-10-23 14:00:00', '2025-10-23 15:00:00', 'ida', 150000, '2025-10-23'),
       (1, 1, 2, '2025-10-23 16:00:00', '2025-10-23 17:00:00', 'ida', 150000, '2025-10-23'),
       (1, 1, 2, '2025-10-23 18:00:00', '2025-10-23 19:00:00', 'ida', 150000, '2025-10-23'),
       (1, 1, 2, '2025-10-23 20:00:00', '2025-10-23 21:00:00', 'ida', 150000, '2025-10-23'),

       (2, 1, 2, '2025-10-24 06:00:00', '2025-10-24 07:00:00', 'ida', 160000, '2025-10-24'),
       (2, 1, 2, '2025-10-24 08:00:00', '2025-10-24 09:00:00', 'ida', 160000, '2025-10-24'),
       (2, 1, 2, '2025-10-24 10:00:00', '2025-10-24 11:00:00', 'ida', 160000, '2025-10-24'),
       (2, 1, 2, '2025-10-24 12:00:00', '2025-10-24 13:00:00', 'ida', 160000, '2025-10-24'),
       (2, 1, 2, '2025-10-24 14:00:00', '2025-10-24 15:00:00', 'ida', 160000, '2025-10-24'),
       (2, 1, 2, '2025-10-24 16:00:00', '2025-10-24 17:00:00', 'ida', 160000, '2025-10-24'),
       (2, 1, 2, '2025-10-24 18:00:00', '2025-10-24 19:00:00', 'ida', 160000, '2025-10-24'),
       (2, 1, 2, '2025-10-24 20:00:00', '2025-10-24 21:00:00', 'ida', 160000, '2025-10-24');

-- Medellín to Bogotá
INSERT INTO flights (plane_id, departure_airport, arrival_airport, dep_time, arr_time, type, price, date)
VALUES (1, 2, 1, '2025-10-23 07:30:00', '2025-10-23 08:30:00', 'ida', 150000, '2025-10-23'),
       (1, 2, 1, '2025-10-23 09:30:00', '2025-10-23 10:30:00', 'ida', 150000, '2025-10-23'),
       (1, 2, 1, '2025-10-23 11:30:00', '2025-10-23 12:30:00', 'ida', 150000, '2025-10-23'),
       (1, 2, 1, '2025-10-23 13:30:00', '2025-10-23 14:30:00', 'ida', 150000, '2025-10-23'),
       (1, 2, 1, '2025-10-23 15:30:00', '2025-10-23 16:30:00', 'ida', 150000, '2025-10-23'),
       (1, 2, 1, '2025-10-23 17:30:00', '2025-10-23 18:30:00', 'ida', 150000, '2025-10-23'),
       (1, 2, 1, '2025-10-23 19:30:00', '2025-10-23 20:30:00', 'ida', 150000, '2025-10-23'),
       (1, 2, 1, '2025-10-23 21:30:00', '2025-10-23 22:30:00', 'ida', 150000, '2025-10-23'),

       (2, 2, 1, '2025-10-24 07:30:00', '2025-10-24 08:30:00', 'ida', 160000, '2025-10-24'),
       (2, 2, 1, '2025-10-24 09:30:00', '2025-10-24 10:30:00', 'ida', 160000, '2025-10-24'),
       (2, 2, 1, '2025-10-24 11:30:00', '2025-10-24 12:30:00', 'ida', 160000, '2025-10-24'),
       (2, 2, 1, '2025-10-24 13:30:00', '2025-10-24 14:30:00', 'ida', 160000, '2025-10-24'),
       (2, 2, 1, '2025-10-24 15:30:00', '2025-10-24 16:30:00', 'ida', 160000, '2025-10-24'),
       (2, 2, 1, '2025-10-24 17:30:00', '2025-10-24 18:30:00', 'ida', 160000, '2025-10-24'),
       (2, 2, 1, '2025-10-24 19:30:00', '2025-10-24 20:30:00', 'ida', 160000, '2025-10-24'),
       (2, 2, 1, '2025-10-24 21:30:00', '2025-10-24 22:30:00', 'ida', 160000, '2025-10-24');

-- Bogotá to Pereira
INSERT INTO flights (plane_id, departure_airport, arrival_airport, dep_time, arr_time, type, price, date)
VALUES (3, 1, 3, '2025-10-23 07:00:00', '2025-10-23 08:15:00', 'ida', 120000, '2025-10-23'),
       (3, 1, 3, '2025-10-23 11:00:00', '2025-10-23 12:15:00', 'ida', 120000, '2025-10-23'),
       (3, 1, 3, '2025-10-23 15:00:00', '2025-10-23 16:15:00', 'ida', 120000, '2025-10-23'),
       (3, 1, 3, '2025-10-23 19:00:00', '2025-10-23 20:15:00', 'ida', 120000, '2025-10-23'),

       (4, 1, 3, '2025-10-24 07:00:00', '2025-10-24 08:15:00', 'ida', 130000, '2025-10-24'),
       (4, 1, 3, '2025-10-24 11:00:00', '2025-10-24 12:15:00', 'ida', 130000, '2025-10-24'),
       (4, 1, 3, '2025-10-24 15:00:00', '2025-10-24 16:15:00', 'ida', 130000, '2025-10-24'),
       (4, 1, 3, '2025-10-24 19:00:00', '2025-10-24 20:15:00', 'ida', 130000, '2025-10-24');

-- Pereira to Bogotá
INSERT INTO flights (plane_id, departure_airport, arrival_airport, dep_time, arr_time, type, price, date)
VALUES (3, 3, 1, '2025-10-23 08:45:00', '2025-10-23 10:00:00', 'ida', 120000, '2025-10-23'),
       (3, 3, 1, '2025-10-23 12:45:00', '2025-10-23 14:00:00', 'ida', 120000, '2025-10-23'),
       (3, 3, 1, '2025-10-23 16:45:00', '2025-10-23 18:00:00', 'ida', 120000, '2025-10-23'),
       (3, 3, 1, '2025-10-23 20:45:00', '2025-10-23 22:00:00', 'ida', 120000, '2025-10-23'),

       (4, 3, 1, '2025-10-24 08:45:00', '2025-10-24 10:00:00', 'ida', 130000, '2025-10-24'),
       (4, 3, 1, '2025-10-24 12:45:00', '2025-10-24 14:00:00', 'ida', 130000, '2025-10-24'),
       (4, 3, 1, '2025-10-24 16:45:00', '2025-10-24 18:00:00', 'ida', 130000, '2025-10-24'),
       (4, 3, 1, '2025-10-24 20:45:00', '2025-10-24 22:00:00', 'ida', 130000, '2025-10-24');

-- Bogotá to Barranquilla
INSERT INTO flights (plane_id, departure_airport, arrival_airport, dep_time, arr_time, type, price, date)
VALUES (2, 1, 4, '2025-10-23 06:30:00', '2025-10-23 08:00:00', 'ida', 180000, '2025-10-23'),
       (2, 1, 4, '2025-10-23 12:30:00', '2025-10-23 14:00:00', 'ida', 180000, '2025-10-23'),
       (2, 1, 4, '2025-10-23 18:30:00', '2025-10-23 20:00:00', 'ida', 180000, '2025-10-23'),

       (1, 1, 4, '2025-10-24 06:30:00', '2025-10-24 08:00:00', 'ida', 190000, '2025-10-24'),
       (1, 1, 4, '2025-10-24 12:30:00', '2025-10-24 14:00:00', 'ida', 190000, '2025-10-24'),
       (1, 1, 4, '2025-10-24 18:30:00', '2025-10-24 20:00:00', 'ida', 190000, '2025-10-24');

-- Barranquilla to Bogotá
INSERT INTO flights (plane_id, departure_airport, arrival_airport, dep_time, arr_time, type, price, date)
VALUES (2, 4, 1, '2025-10-23 09:00:00', '2025-10-23 10:30:00', 'ida', 180000, '2025-10-23'),
       (2, 4, 1, '2025-10-23 15:00:00', '2025-10-23 16:30:00', 'ida', 180000, '2025-10-23'),
       (2, 4, 1, '2025-10-23 21:00:00', '2025-10-23 22:30:00', 'ida', 180000, '2025-10-23'),

       (1, 4, 1, '2025-10-24 09:00:00', '2025-10-24 10:30:00', 'ida', 190000, '2025-10-24'),
       (1, 4, 1, '2025-10-24 15:00:00', '2025-10-24 16:30:00', 'ida', 190000, '2025-10-24'),
       (1, 4, 1, '2025-10-24 21:00:00', '2025-10-24 22:30:00', 'ida', 190000, '2025-10-24');
