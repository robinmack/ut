

-- DROP DATABASE ut;

CREATE DATABASE ut
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
-- Table: public.customer

-- DROP TABLE public.customer;

CREATE TABLE public.customer
(
    id integer NOT NULL DEFAULT nextval('customer_id_seq'::regclass),
    lastname character varying COLLATE pg_catalog."default" NOT NULL,
    firstname character varying COLLATE pg_catalog."default" NOT NULL,
    addr1 character varying COLLATE pg_catalog."default" NOT NULL,
    addr2 character varying COLLATE pg_catalog."default",
    city character varying COLLATE pg_catalog."default" NOT NULL,
    state character varying COLLATE pg_catalog."default" NOT NULL,
    zip character varying COLLATE pg_catalog."default" NOT NULL,
    phone character varying COLLATE pg_catalog."default",
    email character varying COLLATE pg_catalog."default" NOT NULL,
    service character varying COLLATE pg_catalog."default" NOT NULL,
    gender character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT customer_pkey PRIMARY KEY (id),
    CONSTRAINT unique_email_addr UNIQUE (email)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.customer
    OWNER to postgres;

-- Index: email_addr_key

-- DROP INDEX public.email_addr_key;

CREATE UNIQUE INDEX email_addr_key
    ON public.customer USING btree

-- Constraint: customer_pkey

-- ALTER TABLE public.customer DROP CONSTRAINT customer_pkey;

ALTER TABLE public.customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);

-- Constraint: unique_email_addr

-- ALTER TABLE public.customer DROP CONSTRAINT unique_email_addr;

ALTER TABLE public.customer
    ADD CONSTRAINT unique_email_addr UNIQUE (email);

-- Table: public.users

-- DROP TABLE public.users;

CREATE TABLE public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    username character varying COLLATE pg_catalog."default" NOT NULL,
    password character varying COLLATE pg_catalog."default" NOT NULL,
    role bigint NOT NULL,
    email character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to postgres;

-- Constraint: users_pkey

-- ALTER TABLE public.users DROP CONSTRAINT users_pkey;

ALTER TABLE public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
    