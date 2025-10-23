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
       ('José María Córdova', 'Medellín', 'MDE');

-- Flight
INSERT INTO flights (plane_id, departure_airport, arrival_airport, dep_time, arr_time, type, price, date)
VALUES (1, 1, 2, '2025-11-01 08:00', '2025-11-01 09:00', 'ida', 200000, '2025-11-01');
