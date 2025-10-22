-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.  

CREATE TABLE public.airports (
id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
name character varying NOT NULL,
icao character varying NOT NULL UNIQUE,
city_id bigint NOT NULL,
CONSTRAINT airports_pkey PRIMARY KEY (id),
CONSTRAINT airports_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.city(id)
);
CREATE TABLE public.booking (
id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
flight_id bigint NOT NULL,
date timestamp without time zone NOT NULL,
status character varying DEFAULT 'ok'::character varying,
notes character varying DEFAULT ''::character varying,
created_at timestamp without time zone,
CONSTRAINT booking_pkey PRIMARY KEY (id),
CONSTRAINT booking_flight_id_fkey FOREIGN KEY (flight_id) REFERENCES public.flights(id)
);
CREATE TABLE public.city (
id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
state_id bigint NOT NULL,
name character varying NOT NULL,
code character varying NOT NULL UNIQUE,
CONSTRAINT city_pkey PRIMARY KEY (id),
CONSTRAINT city_state_id_fkey FOREIGN KEY (state_id) REFERENCES public.state(id)
);
CREATE TABLE public.country (
id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
name character varying NOT NULL,
code character varying NOT NULL UNIQUE,
CONSTRAINT country_pkey PRIMARY KEY (id)
);
CREATE TABLE public.flights (
id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
plane_id bigint NOT NULL,
departure bigint NOT NULL,
arrival bigint NOT NULL,
dep_time timestamp without time zone NOT NULL,
arr_time timestamp without time zone NOT NULL,
date date NOT NULL,
price numeric NOT NULL,
last_modified timestamp without time zone DEFAULT now(),
CONSTRAINT flights_pkey PRIMARY KEY (id),
CONSTRAINT flights_departure_fkey FOREIGN KEY (departure) REFERENCES public.airports(id),
CONSTRAINT flights_arrival_fkey FOREIGN KEY (arrival) REFERENCES public.airports(id),
CONSTRAINT flights_plane_id_fkey FOREIGN KEY (plane_id) REFERENCES public.planes(id)
);
CREATE TABLE public.flightxseats (
id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
flight_id bigint NOT NULL,
seat_id bigint NOT NULL,
customer_id bigint,
occupied boolean DEFAULT false,
CONSTRAINT flightxseats_pkey PRIMARY KEY (id),
CONSTRAINT flightxseats_flight_id_fkey FOREIGN KEY (flight_id) REFERENCES public.flights(id),
CONSTRAINT flightxseats_seat_id_fkey FOREIGN KEY (seat_id) REFERENCES public.seats(id),
CONSTRAINT flightxseats_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.passengers(id)
);
CREATE TABLE public.invoice (
id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
book_id bigint NOT NULL,
user_id bigint NOT NULL,
name character varying NOT NULL,
doc_type character varying NOT NULL,
num_doc character varying NOT NULL,
email character varying NOT NULL,
phone character varying NOT NULL,
description text NOT NULL,
pay_method character varying NOT NULL,
amount numeric NOT NULL,
CONSTRAINT invoice_pkey PRIMARY KEY (id),
CONSTRAINT invoice_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.booking(id),
CONSTRAINT invoice_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.passengers (
id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
names character varying NOT NULL,
lastname character varying NOT NULL,
snd_lastname character varying NOT NULL,
birthday date NOT NULL,
gender character varying NOT NULL,
doc_type character varying NOT NULL,
doc_num bigint NOT NULL,
is_child boolean,
phone character varying NOT NULL,
email character varying NOT NULL,
user_id bigint NOT NULL,
CONSTRAINT passengers_pkey PRIMARY KEY (id),
CONSTRAINT passengers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.planes (
id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
model character varying NOT NULL,
capacity smallint NOT NULL,
plate character varying NOT NULL UNIQUE,
status character varying,
CONSTRAINT planes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.preferences (
id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
user_id bigint NOT NULL,
theme character varying DEFAULT 'dark'::character varying,
updated_at timestamp without time zone DEFAULT now(),
CONSTRAINT preferences_pkey PRIMARY KEY (id),
CONSTRAINT preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.seats (
id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
plane_id bigint NOT NULL,
code character varying NOT NULL,
type character varying NOT NULL,
add_price numeric NOT NULL,
CONSTRAINT seats_pkey PRIMARY KEY (id),
CONSTRAINT seats_plane_id_fkey FOREIGN KEY (plane_id) REFERENCES public.planes(id)
);
CREATE TABLE public.state (
id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
country_id bigint NOT NULL,
name character varying NOT NULL,
code character varying NOT NULL UNIQUE,
CONSTRAINT state_pkey PRIMARY KEY (id),
CONSTRAINT state_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.country(id)
);
CREATE TABLE public.ticket (
id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
pass_id bigint NOT NULL,
book_id bigint NOT NULL,
fxseat_id bigint NOT NULL,
created_at timestamp with time zone NOT NULL DEFAULT now(),
check_in boolean DEFAULT false,
code uuid DEFAULT gen_random_uuid(),
CONSTRAINT ticket_pkey PRIMARY KEY (id),
CONSTRAINT ticket_fxseat_id_fkey FOREIGN KEY (fxseat_id) REFERENCES public.flightxseats(id),
CONSTRAINT ticket_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.booking(id),
CONSTRAINT ticket_pass_id_fkey FOREIGN KEY (pass_id) REFERENCES public.passengers(id)
);
CREATE TABLE public.user (
id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
name character varying NOT NULL,
lastname character varying NOT NULL,
snd_lastname character varying NOT NULL,
email character varying NOT NULL,
password character varying NOT NULL,
birthday date NOT NULL,
gender character varying NOT NULL,
doc_type character varying NOT NULL,
doc_num character varying NOT NULL,
phone character varying NOT NULL,
role character varying NOT NULL,
updated_at timestamp with time zone DEFAULT now(),
CONSTRAINT user_pkey PRIMARY KEY (id)
);
CREATE TABLE public.usuxbook (
id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
user_id bigint NOT NULL,
book_id bigint NOT NULL,
CONSTRAINT usuxbook_pkey PRIMARY KEY (id),
CONSTRAINT usuxbook_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id),
CONSTRAINT usuxbook_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.booking(id)
);