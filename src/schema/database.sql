-- Database: ut

-- DROP DATABASE ut;

CREATE DATABASE ut
WITH
OWNER = postgres
ENCODING = 'UTF8'
LC_COLLATE = 'en_US.UTF-8'
LC_CTYPE = 'en_US.UTF-8'
TABLESPACE = pg_default
CONNECTION LIMIT = -1;

-- Table: public.customer

-- DROP TABLE public.customer;

CREATE TABLE public.customer
(
    id SERIAL UNIQUE,
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

-- Index: customer_id

-- DROP INDEX public.customer_id;

CREATE UNIQUE INDEX customer_id
    ON public.customer USING btree
    (id)
TABLESPACE pg_default;

-- Index: email_addr_key

-- DROP INDEX public.email_addr_key;

CREATE UNIQUE INDEX email_addr_key
    ON public.customer USING btree
    (email COLLATE pg_catalog."default")
TABLESPACE pg_default;

-- Table: public."order"

-- DROP TABLE public."order";

CREATE TABLE public."order"
(
    id SERIAL UNIQUE,
    customer_id integer NOT NULL,
    card_type character varying COLLATE pg_catalog."default" NOT NULL,
    card_name character varying COLLATE pg_catalog."default" NOT NULL,
    card_number character varying COLLATE pg_catalog."default" NOT NULL,
    card_expire character varying COLLATE pg_catalog."default" NOT NULL,
    card_civ character varying COLLATE pg_catalog."default" NOT NULL,
    shipping character varying COLLATE pg_catalog."default" NOT NULL,
    number_ribbons integer NOT NULL DEFAULT 0,
    number_devices integer NOT NULL DEFAULT 0,
    number_attachments integer NOT NULL DEFAULT 0,
    number_pins integer NOT NULL DEFAULT 0,
    number_magnetic integer NOT NULL DEFAULT 0,
    row_fill character varying COLLATE pg_catalog."default" NOT NULL,
    total_ribbons numeric(8, 2) NOT NULL DEFAULT 0,
    list_ribbons character varying COLLATE pg_catalog."default" NOT NULL,
    number_mini_medal_sets integer NOT NULL DEFAULT 0,
    total_mini_medals numeric(8, 2) NOT NULL DEFAULT 0,
    number_mini_medal_device integer NOT NULL DEFAULT 0,
    number_medal_attach integer NOT NULL DEFAULT 0,
    list_mini_medals character varying COLLATE pg_catalog."default" NOT NULL,
    name_tag_line_1 character varying COLLATE pg_catalog."default" NOT NULL,
    name_tag_line_2 character varying COLLATE pg_catalog."default" NOT NULL,
    number_pin_tag integer NOT NULL DEFAULT 0,
    number_magnetic_tag integer NOT NULL DEFAULT 0,
    tag_branch character varying COLLATE pg_catalog."default" NOT NULL,
    total_name_tag numeric(8, 2) NOT NULL DEFAULT 0,
    comments character varying COLLATE pg_catalog."default" NOT NULL,
    total_order numeric(8, 2) NOT NULL DEFAULT 0,
    total_grand numeric(8, 2) NOT NULL DEFAULT 0,
    number_ribbons_2 integer NOT NULL DEFAULT 0,
    number_devices_2 integer NOT NULL DEFAULT 0,
    number_attach_2 integer NOT NULL DEFAULT 0,
    number_pin_2 integer NOT NULL DEFAULT 0,
    number_magnetic_2 integer NOT NULL DEFAULT 0,
    row_fill_2 character varying COLLATE pg_catalog."default" NOT NULL,
    list_ribbon_2 character varying COLLATE pg_catalog."default" NOT NULL,
    number_large_medal_sets integer NOT NULL DEFAULT 0,
    price_per_large_medal_set numeric(8, 2) NOT NULL DEFAULT 0,
    number_large_medal_device integer NOT NULL DEFAULT 0,
    number_large_medal_attach integer NOT NULL DEFAULT 0,
    anodize character varying COLLATE pg_catalog."default" NOT NULL,
    anodized_total numeric(8, 2) NOT NULL DEFAULT 0,
    total_medals_large numeric(8, 2) NOT NULL DEFAULT 0,
    choice_1_pin character varying COLLATE pg_catalog."default" NOT NULL,
    choice_2_pin character varying COLLATE pg_catalog."default" NOT NULL,
    reverse character varying COLLATE pg_catalog."default" NOT NULL,
    title character varying COLLATE pg_catalog."default" NOT NULL,
    date date NOT NULL,
    number_mini_medal_attach integer NOT NULL DEFAULT 0,
    total_medals numeric(8, 2) NOT NULL DEFAULT 0,
    list_large_medals character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT order_pkey PRIMARY KEY (id),
    CONSTRAINT order_id_key UNIQUE (id),
    CONSTRAINT unique_order UNIQUE (customer_id, date, total_grand)
)
WITH (
OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."order"
    OWNER to postgres;

-- Index: order-customer

-- DROP INDEX public."order-customer";

CREATE INDEX "order-customer"
    ON public."order" USING btree
    (customer_id)
TABLESPACE pg_default;

-- Table: public.users

-- DROP TABLE public.users;

CREATE TABLE public.users
(
    id SERIAL UNIQUE,
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

INSERT INTO public.users (username, password, role, email)
values ("admin", "$2a$10$t0EcKIw7PmSQg2Wu1HX0FeuUlcyenwBhwN1VbZdDqYcHn6FuwUDAK", 0, "writer.robin.mack@gmail.com");
