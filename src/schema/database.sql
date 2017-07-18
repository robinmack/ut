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

-- View: public.customer_order

-- DROP VIEW public.customer_order;

CREATE OR REPLACE VIEW public.customer_order AS
    SELECT a.firstname,
        a.lastname,
        a.email,
        a.service,
        a.state,
        a.zip,
        b.id,
        b.total_grand,
        b.date,
        a.city,
        b.customer_id
    FROM customer a,
        "order" b
    WHERE a.id = b.customer_id
    ORDER BY a.lastname, a.firstname, b.date;

ALTER TABLE public.customer_order
    OWNER TO postgres;
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

CREATE TABLE public.devices_attachments
(
    id          SERIAL UNIQUE,
    image_name  CHARACTER VARYING NOT NULL,
    description CHARACTER VARYING NOT NULL,
    "type"      CHARACTER VARYING NOT NULL,
    breakafter  BOOLEAN           NOT NULL DEFAULT FALSE,
    superimpose BOOLEAN           NOT NULL DEFAULT FALSE
)
WITH (
OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.devices_attachments
    OWNER to postgres;

INSERT INTO devices_attachments (image_name, description, "type", breakafter, superimpose)
    VALUES
('SPACER','1-Space', 'attachment', false, false),
('HALFSPACE','1/2-Space', 'attachment', false, false),
('FOURTHSPACE','1/4-Space', 'attachment', false, false),
('BOL','Bronze Oak Leaf', 'device', false, false),
('SOL','Silver Oak Leaf', 'device', false, false),
('SBS','Small Bronze Star', 'device', false, false),
('SSS','Small Silver Star', 'device', false, false),
('SGS','Small Gold Star', 'device', false, false),
('LBS','Large Bronze Star', 'device', false, false),
('LSS','Large Silver Star', 'device', false, false),
('LGS','Large Gold Star', 'device', false, false),
('GF','Gold Frame', 'attachment', false, true),
('BA','Bronze A', 'attachment', false, false),
('SE','Large Silver E', 'attachment', false, false),
('NE','Navy E', 'attachment', false, false),
('NEW','Navy E Wreath', 'attachment', false, false),
('BM','Bronze M', 'attachment', false, false),
('GN','Gold N', 'attachment', false, false),
('SO','Silver O', 'attachment', false, false),
('BS','Bronze S', 'attachment', false, false),
('SS','Silver S', 'attachment', false, false),
('BV','Bronze V', 'attachment', false, false),
('SV','Silver V', 'attachment', false, false),
('GV','Gold V', 'attachment', true, false),
('SW','Silver W', 'attachment', false, false),
('HA','Hurricane Attachment', 'attachment', false, false),
('PT','Palm Tree', 'attachment', false, false),
('BHG','Bronze Hourglass', 'attachment', false, false),
('SHG','Silver Hourglass', 'attachment', false, false),
('GHG','Gold Hourglass', 'attachment', false, false),
('ME','Marine Emblem', 'attachment', false, false),
('BAD','Berlin Airlift','attachment', false, false),
('ARROW','Arrowhead', 'attachment', false, false),
('BWO','Bronze Winter Over', 'attachment', false, false),
('SWO','Silver Winter Over', 'attachment', false, false),
('GWO','Gold Winter Over', 'attachment', false, false),
('YY','Ying-Yang Korea', 'attachment', false, false),
('BP','Bronze Palm', 'attachment', true, false),
('BDIA','Bronze Diamond', 'attachment', false, false),
('SDIA','Silver Diamond', 'attachment', false, false),
('GDIA','Gold Diamond', 'attachment', false, false),
('BPROP','Bronze Propellor', 'attachment', false, false),
('SPROP','Silver Propellor', 'attachment', false, false),
('GPROP','Gold Propellor', 'attachment', false, false),
('BCAP','CAP Bronze Triangle', 'attachment', false, false),
('SCAP','CAP Silver Triangle', 'attachment', false, false),
('BNOA','NOAA Bronze Triangle', 'attachment', false, false),
('SNOA','NOAA Silver Triangle', 'attachment', false, false),
('BBEE','Bronze Beehive', 'attachment', false, false),
('SBEE','Silver Beehive', 'attachment', false, false),
('GBEE','Gold Beehive', 'attachment', true, false),
('2BK','2 Bronze Knots', 'attachment', false, false),
('3BK','3 Bronze Knots', 'attachment', false, false),
('4BK','4 Bronze Knots', 'attachment', false, false),
('5BK','5 Bronze Knots', 'attachment', false, false),
('1SK','1 Silver Knot', 'attachment', false, false),
('2SK','2 Silver Knots', 'attachment', true, false),
('B0','Bronze 0', 'attachment', false, false),
('B1','Bronze 1', 'attachment', false, false),
('B2','Bronze 2', 'attachment', false, false),
('B3','Bronze 3', 'attachment', false, false),
('B4','Bronze 4', 'attachment', false, false),
('B5','Bronze 5', 'attachment', false, false),
('B6','Bronze 6', 'attachment', false, false),
('B7','Bronze 7', 'attachment', false, false),
('B8','Bronze 8', 'attachment', false, false),
('B9','Bronze 9', 'attachment', false, false),
('G0','Gold 0', 'attachment', false, false),
('G1','Gold 1', 'attachment', false, false),
('G2','Gold 2', 'attachment', false, false),
('G3','Gold 3', 'attachment', false, false),
('G4','Gold 4', 'attachment', false, false),
('G5','Gold 5', 'attachment', false, false),
('G6','Gold 6', 'attachment', false, false),
('G7','Gold 7', 'attachment', false, false),
('G8','Gold 8', 'attachment', false, false),
('G9','Gold 9', 'attachment', true, false);

CREATE TABLE public.awards
(
    id SERIAL UNIQUE,
    ribbon_graphic_name character varying NOT NULL,
    mini_medal_price NUMERIC(8,2),
    large_medal_price NUMERIC(8,2),
    "name" character varying COLLATE pg_catalog."default" NOT NULL,
    "desc" character varying
)
WITH (
OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.awards
    OWNER to postgres;

INSERT INTO public.awards (ribbon_graphic_name, mini_medal_price, large_medal_price, "name", "desc") VALUES
('A', null, 0.00, 'Medal of Honor', 'The United States of America''s highest military honor, awarded for acts of valor above and beyond the call of duty. There are three different versions of the medal, one for the Army, one for the Navy, and one for the Air Force. Members of the Marine Corps and Coast Guard are eligible to receive the Navy version. US law does not allow this ribbon or medal to be stocked or sold.'),
('1', 9.00, 37.00, 'Distinguished Service Cross','Established 1918. For extraordinary heroism in connection with military operations against an opposing armed force.'),
('2', 9.00, 98.00, 'Navy Cross','Authorized February 4, 1919. For extraordinary heroism in connection with military operations against an opposing armed force.'),
('3', 9.00, 88.00, 'Air Force Cross','Established 1960. For extraordinary heroism in connection with military operations against an opposing armed force.'),
('4', 9.00, 88.00, 'Defense Distinguished Service Medal','Established in 1970. For award by the Secretary of Defense for exceptionally meritorious service in a duty of great responsibility.'),
('5', 9.00, 95.00, 'Army Distinguished Service Medal','Authorized in 1918. For exceptionally meritorious service to the government in a duty of great responsibility.'),
('6', 9.00, 108.00, 'Navy Distinguished Service Medal','Authorized in 1919. For exceptionally meritorious service to the government in a duty of great responsibility.'),
('7', 9.00, 95.00, 'Air Force Distinguished Service Medal','For exceptionally meritorious service to the government in a duty of great responsibility.'),
('8', 9.00, 47.00, 'Coast Guard Distinguished Service Medal','Authorized in 1949. For exceptionally meritorious service to the government in a duty of great responsibility.'),
('9', 9.00, 33.00, 'Silver Star','Established in 1918 as the Citation Star,� in 1932 it was redesignated as a medal. For distinguished gallantry in action against an enemy of the United States or while serving with friendly forces against an opposing enemy force.'),
('10', 9.00, 88.00, 'Defense Superior Service Medal','Established in 1976. Awarded by the secretary of defense for superior meritorious service while in a position of significant responsibility while assigned to a joint activity.'),
('10A', 0.00, 0.00, 'Guardian Medal','Authorized by the Secretary of Transportation for Coast Guard members or employees who responded to the terrorist attacks that occurred on September 11, 2.001. Awarded to senior government transportation officials for exceptional performance of duty.'),
('11', 9.00, 35.00, 'Legion of Merit','Authorized in 1942, For exceptionally meritorious conduct in the performance of outstanding service.'),
('12', 9.00, 24.00, 'Distinguished Flying Cross','Established 1926, retroactive to 1918. For heroism or extraordinary achievement in aerial flight.'),
('13', 9.00, 33.00, 'Soldier''s Medal','Created 1926. For heroism by those serving with the Army in any capacity that involves the voluntary risk of life under conditions other than those of conflict with an opposing armed force.'),
('14', 9.00, 29.00, 'Navy and Marine Corps Medal','Established 1942. For acts of heroism not involving actual conflict with an opposing armed force.'),
('15', 9.00, 3.000, 'Airman''s Medal','Created 1960. For heroism that involves the voluntary risk of life under conditions other than those of conflict with an opposing force.'),
('16', 9.00, 88.00, 'Coast Guard Medal','Authorized 1951. For acts of heroism not involving actual conflict with an opposing armed force.'),
('17', 0.00, 0.00, 'Gold Lifesaving Medal','Authorized 1946. For award to any member of the Coast Guard who rescues, or endeavors to rescue any other person from drowning, shipwreck, or other peril of the water in waters at the risk of the rescuer''s own life.'),
('18', 9.00, 2.000, 'Bronze Star Medal','Authorized 1944. For heroic or meritorious achievement of service, not involving aerial flight in connection with operations against an opposing armed force.'),
('19', 9.00, 32.00, 'Purple Heart','Authorized 1932. Awarded for wounds or death as result of an act of any opposing armed force, as a result of an international terrorist attack or as a result of military operaitons while serving as part of a peacekeeping force.'),
('20', 9.00, 15.00, 'Defense Meritorious Service Medal','Created in 1977. Awarded in the name of secretary of defense for recognition of non-combat meritorious achievement or service while assigned to a joint activity.'),
('21', 9.00, 15.00, 'Meritorious Service Medal','Established 1969. For Outstanding non-combat meritorious achievement or service to the United States.'),
('22', 9.00, 23.00, 'Air Medal','Established 1942. For meritorious achievement while participating in aerial flight or for a single act of heroism against an armed enemy.'),
('23', 9.00, 28.00, 'Aerial Achievement Medal','Authorized 1988. For sustained meritorious achievement while participating in aerial flight.'),
('24', 0.00, 0.00, 'Silver Lifesaving Medal','Authorized 1946. For award to any member of the Coast Guard who rescues, or endeavors to rescue any other person from drowning, shipwreck, or other peril of the water in waters within the United States or subject to U.S. jurisdiction.'),
('25', 9.00, 29.00, 'Joint Service Commendation Medal','Authorized 1963. For meritorious achievement or service while assigned to a joint activity.'),
('26', 9.00, 14.00, 'Army Commendation Medal','Authorized 1945. For heroism, meritorious achievement or meritorious service.'),
('27', 9.00, 14.00, 'Navy and Marine Corps Commendation Medal','Authorized 1944. For heroism, meritorious achievement or meritorious service.'),
('28', 9.00, 14.00, 'Air Force Commendation Medal','Authorized 1958. For heroism, meritorious achievement or meritorious service.'),
('29', 9.00, 18.00, 'Coast Guard Commendation Medal','Authorized 1947. For heroism, meritorious achievement or meritorious service.'),
('30', 9.00, 19.00, 'Joint Service Achievement Medal','Created 1983. For meritorious achievement or service while assigned to a joint activity.'),
('30A', 9.00, 16.00, '9_11 Medal','Authorized by the Secretary of Transportation for Coast Guard employees who responded to terrorist attacks on September 11, 2.001.'),
('31', 9.00, 14.00, 'Army Achievement Medal','Established 1981. Awarded to members who, while serving in any capacity with the Army in a non-combat area distinguish themselves by meritorious service or achievement.'),
('32', 9.00, 14.00, 'Navy and Marine Corps Achievement Medal','Created 1961. For junior officers and enlisted personnel whose professional and/or leadership achievements are clearly of a superlative nature.'),
('33', 9.00, 14.00, 'Air Force Achievement Medal','Authorized 1981. For heroism, meritorious service or meritorious achievement.'),
('34', 9.00, 18.00, 'Coast Guard Achievement Medal','Authorized 1967. For military personnel whose professional achievements and/or leadership are of a clearly superlative nature.'),
('35', null, null, 'Coast Guard Commandants Letter of Commendation','For personnel whose achievements merit recognition to a lesser degree than an Achievement Medal.'),
('36', null, null, 'Combat Action Ribbon','For active participation in ground or surface combat subsequent to 1 March 1961 while in the grade of captain/colonel or junior thereto.'),
('36C', 9.00, 18.00, 'Air Force Combat Action Medal','For active participation in combat.'),
('36G', null, null, 'Coast Guard Combat Action','For active participation in combat.'),
('37', null, null, 'Distinguished Presidential Unit Citation','For service in a unit cited in the name of the president for extraordinary heroism in action occurring on or after 7 December 1941.'),
('38', null, null, 'Navy Presidential Unit Citation','For service in a unit cited in the name of the president for outstanding performance in action.'),
('38B', null, null, 'Coast Guard Presidential Unit Citation','For service in a unit cited in the name of the president for outstanding performance in action.'),
('39', null, null, 'Joint Meritorious Unit Citation','Recognizes joint units or activities for meritorious achievement or service superior to that which would normally be expected during combat or declared national emergency or under extraordinary circumstances that involve the national interest.'),
('39A', null, null, 'DOT Secretary Outstanding Unit','Awarded to the entire Coast Guard in 1994by the Secretary of Transportation for meritorious service throughout 1994.'),
('40', null, null, 'Valorous Unit Award','Awarded to units for extraordinary heroism in action on or after 3 August 1963.'),
('40G', null, null, 'Air Force Gallant Unit Award','Authorized by the Secretary of the Air Force in March of 2.001. For extraordinary heroism in action against an armed enemy of the United States while engaged in military operations involving conflict with an opposing force on or after September 11, 2.001.'),
('41', null, null, 'Army Meritorious Unit Award','Awarded to a unit for at least six months of outstanding service during a period of combat on or after 1 January 1944.'),
('41A', null, null, 'Air Force Meritorious Unit Award','Authorized by the Secretary of the Air Force in March 2.004, for exceptionally meritorious conduct in the performance of outstanding achievement or service in direct support of combat operations for at least 90 consecutive days on or after September 11, 2.001.'),
('42', null, null, 'Navy Unit Commendation','For Outstanding heroism or action in an extremely meritorious service not involving combat, but in support of military operations.'),
('43', null, null, 'Air Force Outstanding Unit Award','In recognition of exceptionally meritorious service or outstanding achievement of a numbered unit whether in peacetime or wartime.'),
('44', null, null, 'Coast Guard Unit Commendation','Awarded to a unit for meritorious service rendering it outstanding compared to others providing similar services.'),
('45', null, null, 'Army Superior Unit Award','For outstanding meritorious performance by a unit of a difficult and challenging mission.'),
('46', null, null, 'Air Force Organizational Excellence Award','In recognition of exceptionally meritorious service or outstanding achievement of an organization or activity whether in peacetime or wartime.'),
('47', null, null, 'Meritorious Unit Commendation','For valorous or meritorious achievement or service that renders the unit outstanding as compared to other units performing the same service.'),
('48', null, null, 'Coast Guard Meritorious Unit Commendation','Awarded to a unit for meritorious service rendering it outstanding compared to others providing similar services.'),
('48A', null, null, 'Coast Guard ''E'' Ribbon','For serving aobard their unit for more than 50 percent of the period during which it undergoes Refresher Training and earns the overall operational readiness ''E'' award.'),
('48B', null, null, 'Coast Guard Meritorious Team','For Operational Distinguishing Service.'),
('49', null, null, 'Navy ''E'' Ribbon','Awarded to note permanent duty on/with ships or squadrons that won the battle efficiency competitions subsequent to 1 July 1974.'),
('49A', null, null, 'Coast Guard Bicentennial Unit Award','Awarded to all Coast Guard members serving satisfactorily during any period from 4 June 1989 to 4 August 1990.'),
('50A', 9.00, 14.00, 'Prisoner of War Medal','Awarded to any person who was taken prisoner of war and held captive after 5 April 1917, during World Wars I and II, Korea and Vietnam conflicts and Operation Desert Storm.'),
('51', 9.00, 14.00, 'Combat Readiness Medal','For completion of an aggregate of two years of sustained individual combat or mission readiness or preparedness for direct weapon system deployment.'),
('52', null, null, 'Reserve Special Commendation','Awarded to Reserve Officers with 4 years of successful command and a total Reserve service of 10 years. Established in 1946. (Obsolete)'),
('53', 9.00, 14.00, 'Good Conduct Medal','Awarded for exemplary behavior, efficiency and fidelity while on active duty.'),
('54', 9.00, 14.00, 'Navy Good Conduct Medal','For three years of continuous active service by an enlisted member of the Navy, of a creditable above-average nature in the areas of professional performance, military behavior, leadership, military appearance and adaptability.'),
('55', 9.00, 14.00, 'Marine Corps Good Conduct Medal','For three years of continuous active service by an enlisted member of the Marine Corps or Marine Corps Reserve, of a creditable above-average nature in the areas of obedience, sobriety, neatness, bearing and intelligence.'),
('56', 9.00, 14.00, 'Air Force Good Conduct Medal','Awarded for exemplary behavior, efficiency and fidelity during a three-year period of service.'),
('57', 9.00, 14.00, 'Coast Guard Good Conduct Medal','For three years of above-average continuous service (after 1 January 1980) by an enlisted member of the Coast Guard or Coast Guard Reserve.'),
('58A', 9.00, 14.00, 'Air Reserve Forces Meritorious Service Medal','For exemplary behavior, efficiency, and fidelity during a four-year period while serving in an enlisted status in the Air Force Reserve Forces.'),
('59', 9.00, 14.00, 'Army Reserve Component Achievement Medal','For exemplary behavior, efficiency and fidelity while serving as a member of an Army National guard or Reserve Troop Program Unit.'),
('60', 9.00, 14.00, 'Naval Reserve Meritorious Service Medal','For fulfillment with distinction the obligations of inactive reservists during any four consecutive years.'),
('61', 9.00, 14.00, 'Selected Marine Corps Reserve Medal','For four conseutive years service in Selected Marine Corps Reserve and fulfillment of certain designated military service requirements during the period.'),
('62', 9.00, 24.00, 'Coast Guard Reserve Good Conduct Medal','For fulfillment with distinction the obligations of inactive Coast Guard Reservists for a three-year period.'),
('62A', null, null, 'Coast Guard Person of the Year Medal','Established by the Commandment of the Coast Guard on Jan. 24, 2.003. Awarded to recognize exemplary men and women from the active and reserve enlisted work force, who reflect the spirit of pride, professionalism, and dedication of the Coast Guard.'),
('63', null, null, 'Fleet Marine Force Ribbon','Awarded to officers and enlisted men of the Navy who serve with Marine Corps elements and demonstrate exceptional Navy qualifications in providing support in a combat environment.'),
('64', 9.00, 14.00, 'Navy Expeditionary Medal','Awarded to officers and enlisted men of the Navy and Coast Guard for opposed landing on foreign territory or operations deserving special recognition for which service no other campaign medal has been awarded.'),
('65', 9.00, 18.00, 'Marine Expeditionary Medal','For opposed landing on foreign territory or operations deserving special recognition for which service no other campaign medal has been awarded.'),
('66', null, null, 'Outstanding Airman of the Year Ribbon','Awarded to airmen selected to represent their major air commands/ separate operating agencies/direct reporting units in the annual 12 Outstanding Airmen of the Year Program.'),
('67', null, null, 'Air Force Recognition Ribbon','Authorized by the chief of staff in 1980. Awarded to U.S. Air Force recipients of trophies and awards.'),
('67A', 9.00, 33.00, 'China Service Medal','For service in China. 7 July 1937 to 7 Sept 1939 (Navy/Marine Corps) and 2 Sept 1945 to 1 Apr 1957 (Navy/Marines/Coast Guard).'),
('68', 9.00, 14.00, 'American Defense Service Medal','Authorized on june 28, 1941. Awarded to al Navy and Marine Corps. Service members who served on active duty between Sept. 8, 1939 & Dec. 7, 1941. U.S. Army members were required to have had served for at least 12 months.'),
('WAC', 0.00, 0.00, 'Women''s Army Corps Service Medal','Authorized July 29, 1943. Awarded for military Service in both the Womens Army 1943 auxiliary Corps. between July 10, 1942 & Aug. 31, 1943 and the Women''s Army Corps. between Sept. 1, 1943 & Sept. 2, 1945.'), 
('69', 9.00, 14.00, 'American Campaign Medal','Authorized by Executive Order 9265 on Nov.6,1942.  Awarded to Service Members serving outside the continental U.S.for 30 days between Dec. 7, 1941 & Mar. 2, 1946, or who served during that period for one year inside the continental United States.'),
('70', 9.00, 14.00, 'Asian-Pacific Campaign Medal','Authorized by Executive Order 9265 on Nov. 6, 1942. Awarded for one of the following -assigned outside the continental U.S. for 30 days between Dec.7, 1941 & Mar.2, 1946 -is a recovered POW or evader in the combat zone -or engaged the enemy.'),
('71', 9.00, 14.00, 'European-African-Middle Eastern Campaign Medal','Authorized by the Executive Order 9265 on Nov.6, 1942. Awarded for similar conditions as for the Asiatic/Pacific Campaign Medal, -assigned outside the continental U.S. for 30 days between Dec.7, 1941 & Mar.2, 1946 - a recovered POW or engaged the enemy.'),
('72', 9.00, 14.00, 'World War II Victory Medal','Awarded by Act of Congress on July 6, 1945 for those who served at least one day active federal service between Dec. 7, 1941 and Dec. 31, 1946.'),
('73', 9.00, 14.00, 'Occupation Medal','For 30 consecutive days service after World War II at a normal post of duty while asigned to an army of occupation.'),
('74', 9.00, 28.00, 'Medal for Humane Action','Authorized by an act of Congress July 20, 1949. Awarded to members of the Armed Forces of the U.S. when recommended for meritorious participation for service in the Berlin Airlift.'),
('76', 9.00, 14.00, 'National Defense Service Medal','For active federal service in the armed forces, including the Coast Guard, between 27 Jun 1950 to Jul 1954 (Korea), 1 Jan 1961 to 14 Aug 1974 (Vietnam), 2 Aug 1990 to 30 Nov 1995 (Persian Gulf), 11 Sep 2.001 to date to be determined (War on Terror).'),
('77', 9.00, 14.00, 'Korean Service Medal','For participation in operations for 30 consecutive days in the Korean area between 27 Jun 1950 and 27 Jul 1954.'),
('78', 9.00, 2.000, 'Antarctica Service Medal','For participating in an expedition, operation or support of a U.S. Operation in Antarctica after 1 Jan 1946 to a date to be announced.'),
('79', 9.00, 15.00, 'Coast Guard Arctic Service','For participation in an expedition, operation or support of an operation in excess of 21 consecutive days in the Arctic.'),
('80', 9.00, 14.00, 'Armed Forces Expeditionary Medal','For participating in designated operations after 1 July 1958.'),
('81', 9.00, 14.00, 'Vietnam Service Medal','For service in Southeast Asia and contiguous waters or air space thereover from 4 Jul 1965 to 28 Mar 1973.'),
('81A', 9.00, 14.00, 'Southwest Asia Service Medal','For service in Southwest Asia and contiguous waters or air space thereover from 2 Aug 1990 until a date to be determined by the Secretary of Defense.'),
('81K', 9.00, 14.00, 'Kosovo Campaign Medal','Approved by President Clinton. Recognizing the accomplishments of military Service Members participating or in direct support of Kosovo operations, other areas of eligibility established by each Service.'),
('812', 9.00, 16.00, 'Afghanistan Campaign Medal','Authorized by Executive Order, November 2.004. Awarded for service in Afghanistan or contiguous airspace from October 2.001 to Present.'),
('813', 9.00, 16.00, 'Iraq Campaign Medal','Authorized by Executive Order, November 2.004. Awarded for service in Iraq or contiguous airspace or waters from March 2.003 to Present.'),
('814', 9.00, 14.00, 'Inherent Resolve Campaign Medal','.'),
('81L', 9.00, 14.00, 'GWOT Expeditionary Medal','Established by President George W. Bush on Mar. 12, 2.003. Awarding members of the U.S. Armed Forces who serve or have served in military expeditions to combat terrorism on or after Sept. 11, 2.001.'),
('81S', 9.00, 14.00, 'GWOT Service Medal','Established by President George W. Bush on Mar. 12, 2.003. Awarding members of the United States Armed Forces who serve or have served in military operations to combat terrorism on or after Sept. 11, 2.001.'),
('KDSM', 9.00, 14.00, 'Korea Defense Service Medal','The POA is from July 28, 1954, to a future termination date to be prescribed by the Secretary of Defense.'),
('81M', 9.00, 16.00, 'Armed Forces Service Medal','For members of the Armed Forces participating in peaceful U.S. operations, not in the face of foreign armed opposition or imminent hostile action after 1 June 1992, for which no other U.S. service medals are available.'),
('82', 9.00, 14.00, 'Humanitarian Service Medal','For meritorious direct participation in a significant military act or operation of a humanitarian nature performed after 1 April 1975.'),
('82A', null, null, 'Coast Guard Special Operations Service','For participation in a Coast Guard special operation approved by the area commander or commandant.'),
('82B', 9.00, 16.00, 'Military Outstanding Volunteer Service Medal','Established by Executive Order 12830 on Jan. 9, 1993. Awarded for Service Members of the U.S. who perform outstanding volunteer service of a substantial and consequential nature, this award is meant for long-lasting support, not a single act.'),
('82M', null, null, '9_11 Ribbon','Awarded to any individuals serving in any capacity with the Dept. of Transportation on September 11, 2.001.'),
('83', null, null, 'Sea Service Deployment Ribbon','Recognizes the unique and demanding nature of sea service and the arduous duty attendant with deployment, subsequent to 15 August 1974.'),
('84', null, null, 'Coast Guard Sea Service Ribbon','For completion of two years or more of cumulative sea duty on a U.S. Coast Guard cutter 65 feet or more in length in an active status, in commission or in service.'),
('84A', null, null, 'Army Sea Duty Ribbon',''),
('85', null, null, 'Navy Arctic Service Ribbon','For participation in operations in support of the Arctic Warfare Program on or after 1 January 1982.'),
('85A', null, null, 'Naval Reserve Sea Service Ribbon','For any combination of active or Selected Reserve service after 14 August 1974 aboard a Naval Reserve ship or its Reserve unit or an embarked active or Reserve staff for a cumulative total of 36 months.'),
('86', null, null, 'Navy and Marine Corps Overseas Service Ribbon','For 12 consecutive or accumulated active duty months at an overseas duty station, or for 30 consecutive days or 45 cumulative days of active duty for training or temporary active duty after 14 August 1974.'),
('86A', null, null, 'Navy Recruiting Ribbon','For completion of a successful tour of Navy recruiting duty after 1 January 1980.'),
('86M', 9.00, 14.00, 'Air and Space Campaign Medal','Established by the Secretary of the Air Force on Apr. 24, 2.002 to recognize members of the Air Force who participate in or directly support a significant U.S. military combat operation from outside the geographic area designated for that operation.'),
('NDOS',9.00, 14.00, 'Nuclear Deterrence Operations Service Medal',''),
('87', null, null, 'Air Force Overseas Ribbon (short)','For an overseas short tour of duty.'),
('87A', null, null, 'Marine Recruiting Ribbon','Established on June 7, 1995 by the Secretary of the Navy. Awarded for successful completion of three consecutive years of recruiting duty in an assigned billet. This ribbon can be awarded retroactively to Jan. 1, 1973.'),
('87D', null, null, 'Marine Corps Drill Instructor Ribbon','Approved by the Commandment of the Marine Corps. on Aug. 14, 1997. Awarded to Marines who successfully complete a tour of duty and possess a MOS 8511.'),
('87N', null, null, 'Navy Accession Training Service Ribbon','Approved by the Secretary of the Navyon Feb.2, 1989. Awarded to recognize the unique and demanding nature of recruiting duty, awarded when personnel complete three consecutive years of recruiting duty.'),
('87S', null, null, 'Marine Security Guard Ribbon','Approved by the Commandment of the Marine Corps. On August 14, 1997. Awarded to Marines who possess the MOS 8151 who successfully complete 24 months of service at a foreign service establishment.'),
('87C', null, null, 'Marine Corps Combat Instructor Ribbon',''),
('88', null, null, 'Air Force Overseas Ribbon (long)','For an overseas long tour of duty.'), 
('88M', null, null, 'Air Force Expeditionary Service Ribbon','Authorized June 18, 2.003. For Air Force personnel who complete a contingency deployment for 45 consecutive or 90 nonconsecutive days.'),
('89', null, null, 'Air Force Longevity Service Award Ribbon','Awarded on completion of 4 years service in the Air Force and each subsequent 4 year period.'),
('89S', null, null, 'Air Force Special Duty Ribbon',''),
('89A', null, null, 'Air Force Military Training Instructor','Established by the Secretary of the Air Force on Dec. 7, 1998, for active duty, Reserve, and Air National Guard personnel upon completion of Military Training Instructor School, the award becomes permanent after completion of 1 year duty as Instructor.'),
('89R', null, null, 'Air Force Recruiting Ribbon','Awarded to personnel who accrue 36 months of duty in a designated recruiter position. Approved June 21, 2.000.'),
('90', null, null, 'Coast Guard Restricted Duty Ribbon','For completion of a permanent-change-of-station (PCS) tour of duty where accompanying dependents are not authorized.'),
('90C', null, null, 'Coast Guard Overseas Service Ribbon','For completion of a tour of duty in a recognized overseas location.'),
('91', null, null, 'Coast Guard Basic Training Honor Graduate','For members in the top 3 percent of each Coast Guard recruit training graduating class.'),
('91A', null, null, 'Coast Guard Recruiting Ribbon','Established on Nov. 2, 1995 by Commandant of the Coast Admiral Robert E. Kramek. Awarded to those who complete a minimum of two consecutive years of recruiting duty after Jan. 1, 1980.'),
('91G', null, null, 'Navy Ceremonial Guard','Established by the Secretary of the Navy, December 2.003. Awarded to personnel assigned to the Ceremonial Guard in Washington DC on or after May 1, 2.001 and after completion of 18 months drilling status.'),
('91N', null, null, 'Navy Basic Training Honor Graduate','For members graduating at the top of the basic training class.'),
('92', 9.00, 14.00, 'Armed Forces Reserve Medal','For ten years of honorable and satisfactory military service in one or more Reserve components of the U.S. Armed Forces.'),
('93', null, null, 'Army NCO Professional Development Ribbon','Awarded for completion of designated non-commissioned officer professional development Courses.'),
('94', null, null, 'Army Service Ribbon','For successful completion of initial-entry training after 1 Aug 1981.'),
('95', null, null, 'Army Overseas Ribbon','For successful completion of overseas tours.'),
('96', null, null, 'Army Reserve Overseas Training','For successful completion of annual training or active duty for training for a period not less than 10 consecutive duty days on foreign soil.'),
('98', null, null, 'AF Professional Military Ed. Graduate Ribbon','For graduation from a certified accredited Air Force non-commissioned officer profesional military education school.'),
('99', null, null, 'USAF BMT Honor Graduate Ribbon','Awarded to honor graduates of BMT who have demonstrated excellence in all phases of academic and military training.'),
('100', null, null, 'Small Arms Expert Marksmanship Ribbon','Awarded to personnel who qualify as expert in small arms marksmanship.'),
('101', null, null, 'Air Force Training Ribbon','For completion of Air Force initial military-accession training on or after 14 August 1974.'),
('102', 9.00, 19.00, 'Naval Reserve Medal','For 10 years of service in the Naval Reserve. (Obsolete)'),
('103', null, null, 'US Marine Corps Reserve Ribbon (OBSO)','For 10 years of service in the Marine Corps Reserve prior to 18 December 1965. (Obsolete)'),
('104', 9.00, 23.00, 'Philippine Defense Ribbon','Authorized by the Phillippine Government. Awarded for combat service in the defense of the Phillippines from Dec. 8, 1941- June 15, 1942. The medal is not authorized to be worn on a uniform, but the ribbon is allowed.'),
('105', 9.00, 23.00, 'Philippine Liberation Ribbon','Authorized by Dept. of the Army Cir 59, in Mar. of 1948. Awarded for participation in the liberation of the Phillippines from Oct. 17, 1944- Sept. 3, 1945. The medal is not authorized to be worn on the uniform, but the ribbon is allowed.'),
('106', 9.00, 26.00, 'Philippine Independence','Awarded to Service Members who are recipients of both the Phillippine Defense and the Phillippine Liberation ribbons. Authorized by Dept. of the Army Cir 59, in 1948.'),
('107', null, null, 'Philippine Presidential Unit Citation','For service in defense and liberation of the Philippines during World War II.'),
('108', null, null, 'Republic of Korea Presidential Unit Citation','For Service in Korea from 27 June 1950 to 27 July 1953.'),
('109', null, null, 'Republic of Vietnam Presidential Unit Citation','For humanitarian assistance given during the August-September 1954 evacuation of civilians from north and Central Vietnam.'),
('111',0.00, 0.00, 'Vietnam Military Merit','Awarded on Aug. 15, 1950 for distinction in bravery or devotion to duty, wounds in combat, or heroism.'),
('112',0.00, 0.00, 'Vietnam Air Gallantry','Awarded for display of heroism and exceptional bravery in flight or in extremely dangerous situations. Established June 5, 1964.'),
('113-1',0.00, 0.00, 'Vietnam Honor Medal 1st Class','Awarded for outstanding contributions to the training and development of RVN Armed Forces.'),
('113-2',0.00, 0.00, 'Vietnam Honor Medal 2nd Class','Awarded for outstanding contributions to the training and development of RVN Armed Forces.'),
('114-1',0.00, 0.00, 'Vietnam Staff Service 1st Class','Awarded for outstanding initiative and devotion to their staff duties.'),
('114-2',0.00, 0.00, 'Vietnam Staff Service 2nd Class','Awarded for outstanding initiative and devotion to their staff duties.'),
('115-1',0.00, 0.00, 'Vietnam Tech Service 1st Class','For military servicemen and civilians working as military technicians who have shown outstanding professional capacity, initiative and devotion to duty. Established June 5, 1964.'),
('115-2',0.00, 0.00, 'Vietnam Tech Service 2nd Class','For military servicemen and civilians working as military technicians who have shown outstanding professional capacity, initiative and devotion to duty. Established June 5, 1964.'),
('116-1',0.00, 0.00, 'Vietnam Training Service 1st Class','For instructors and cadres at military schools and training centers who contribute significantly to training. Established on May 12, 1964.'),
('116-2',0.00, 0.00, 'Vietnam Training Service 2nd Class','For instructors and cadres at military schools and training centers who contribute significantly to training. Established on May 12, 1964.'),
('118', 9.00, 15.00, 'Vietnam Gallantry Cross Unit Citation','Awarded by the Republic of Vietnam to units for valorous combat achievement.'),
('118A-1', 9.00, 23.00, 'Vietnam Civil Action 1st Class','Awarded by the Republic of Vietnam to units in recognition of meritorious civil action service.'),
('118A-2', 9.00, 23.00, 'Vietnam Civil Action 2nd Class','Awarded by the Republic of Vietnam, for outstanding achievement in the field of civil actions.'),
('119', 9.00, 24.00, 'United Nations Service Medal','For Service in the Korean area in support of UN action from 27 Jun 1950 to 27 Jul 1954; and those who are also eligible for the Korean Service Medal.'),
('119A', 9.00, 24.00, 'InterAmerican Defense','For at least one year of service on the Inter-American Defense Board in selected positions.'),
('120', 9.00, 29.00, 'United Nations Medal','For not less than six months'' service with a UN Observers Group.'),
('120A', 9.00, 17.00, 'Multi National Forces Observer','For at least consecutive 90 days of service with the Multinational Force and Observers Organization.'),
('120B', 9.00, 16.00, 'NATO Medal','Authorized by Secretary General of NATO for specific NATO operations.'),
('120-UNTAC', 9.00, 29.00, 'UN Service Cambodia (UNTAC)','A United Nations mission to Cambodia from March 1992- September 1993.'),
('120-UNAMIC', 9.00, 29.00, 'UN Service Cambodia (UNAMIC)','A United Nations mission to Cambodia from November 1991- March 1992.'),
('120-UNMIH', 9.00, 29.00, 'UN Service Haiti (UNMIH)','A United Nations mission to Haiti from September 1993- June 1996.'),
('120-UNIKOM', 9.00, 29.00, 'UN Service Iraq/Kuwait (UNIKOM)','A United Nations mission to Iraq- Kuwait from April 1991- present.'),
('120-UNIPOM', 9.00, 29.00, 'UN Service India/Pakistan (UNIPOM)','A United Nations mission to India- Pakistan from September 1965- March 1966.'),
('120-MINURSO', 9.00, 29.00, 'UN Service Sahara (MINURSO)','A United Nations mission in Western Sahara from September 1991- present.'),
('120-UNOSOM', 9.00, 29.00, 'UN Service Somalia (UNOSOM)','A United Nations mission to Somalia from April 1992- April 1993.'),
('120-UNCRO', 9.00, 29.00, 'UN Service Croatia (UNCRO)','A United Nations mission to Croatia from March 1995- January 1996.'),
('120-UNPREDEP', 9.00, 29.00, 'UN Service (UNPREDEP)','A United Nations mission'),
('120-UNPROFOR', 9.00, 29.00, 'UN Service Yugoslavia/Croatia (UNPROFOR)', 'A United Nations mission to former Yugoslavia from March 1992- January 1995.'),
('120K', 9.00, 16.00, 'Kosovo NATO Medal','Awarded by the Secretary General of NATO. The authorization to award this medal is the sole perogative of the Secretary General of NATO.'),
('NATOISAF',9.00, 16.00, 'NATO NON-Article 5 ISAF','Awarded by the Secretary General of NATO. The authorization to award this medal is the sole perogative of the Secretary General of NATO.'),
('NATOBALKANS',9.00, 16.00, 'NATO NON-Article 5 Balkans','Awarded by the Secretary General of NATO. The authorization to award this medal is the sole perogative of the Secretary General of NATO.'),
('NATOEAGLE',0.00, 16.00, 'NATO Article 5 Eagle Assist','Awarded by the Secretary General of NATO. The authorization to award this medal is the sole perogative of the Secretary General of NATO.'),
('NATOENDEAVOR',0.00, 16.00, 'NATO Article 5 Active Endeavor','Awarded by the Secretary General of NATO. The authorization to award this medal is the sole perogative of the Secretary General of NATO.'),
('121',0.00, 0.00, 'Vietnam Air Service Medal','Authorized May 12, 1964. Awarded to personnel of all ranks and service branches who had completed a prescribed number of flight hours onboard all types of aircraft.'),
('122', 9.00, 16.00, 'Republic of Vietnam Campaign Medal','For six months direct combat support or service in South Vietnam between 1 March 1961 and 28 March 1973. Also for those wounded, captured or killed in action or in the line of duty during the same period.'),
('122A', 9.00, 23.00, 'Kuwait Liberation Medal (Kingdom of Saudi Arabia)','Awarded by the Kingdom of Saudi Arabia for direct participation in Operation Desert Storm between 17 January 1991 and 28 February 1991.'),
('123A', 9.00, 17.00, 'Kuwait Liberation Medal (Government of Kuwait)','Awarded by the Emirate of Kuwait to US Armed Forces personnel who participated in operations Desert Shield/Desert Storm between 2 August 1990 and 31 August 1993.'),
('124K', 9.00, 14.00, 'Korean War Service Medal','Authorized by Executive Order 10179 on Nov. 8, 1950. Awarded to all branches of the Armed Forces whose personnel served 30 consecutive or 60 nonconsecutive days during June 27, 1950 - July 27, 1954.'),
('125E', 9.00, 14.00, 'Navy Expert Rifle','A qualification award presented to members of the Navy and Naval Reserve who qualify as EXPERT with either the rifle or carbine on a prescribed military course.'),
('125', null, null, 'Navy Marksman Rifle','A qualification award presented to members of the Navy and Naval Reserve who qualify as sharpshooter, but less than expert with either the rifle or carbine on a prescribed military course. No medal is authorized for this qualification'),
('126E', 9.00, 14.00, 'Navy Expert Pistol','A qualification award presented to members of the Navy and Naval Reserve who qualify as EXPERT with military pistol on a prescribed military course.'),
('126', null, null, 'Navy Marksman Pistol','A qualification award presented to members of the Navy and Naval Reserve who qualify as sharpshooter, but less than expert with military pistol on a prescribed military course. No medal is authorized for this qualification.'),
('127E', 9.00, 14.00, 'Coast Guard Expert Rifleman','A qualification badge awarded to personnel of the Coast Guard and Reserves who have qualified as EXPERT with the military service rifle or carbine.'),
('127', null, null, 'Coast Guard Rifleman','A qualification badge awarded to personnel of the Coast Guard and Reserves who have qualified with the military service rifle or carbine.'),
('128E', 9.00, 14.00, 'Coast Guard Expert Pistol','A qualification badge awarded to personnel of the Coast Guard and Reserves who have qualified as EXPERT with the military service pistol.'),
('128', null, null, 'Coast Guard Pistol','A qualification badge awarded to personnel of the Coast Guard and Reserves who have qualified with the military service pistol.'),
('CIV1',0.00, 0.00, 'Presidential Medal of Freedom', 'Awarded for highly meritorious contributions to -the national interests of the U.S., -world peace, -or cultural or other significant public or private endeavors. Established by President Truman in 1945 and reestablished by President Kennedy in 1963.'),
('CIV10',0.00, 0.00, 'National Security Medal', 'Awarded by the President of the US to any individual for distinguished achievement or outstanding contribution on or after 26 July 1947, in the field of intelligence relating to national security.'),
('CIV30',0.00, 0.00, 'Department of State Meritorious Honor', 'Awarded to groups or individuals in recognition of a special act or service to the Department of State'),
('CIV40',0.00, 0.00, 'National Intelligence Distinguished Service Medal', 'Awarded to any member of the National Intelligence Agency, either civilian or military, who distinguishes themselves by meritorious actions to the betterment of national security in the United States of America.'),
('CIV011',0.00, 0.00, 'National Intelligence Medal of Achievement', 'Awarded for general meritorious service to the mission of the National Intelligence Agency and may be awarded for a variety of accomplishments.'),
('CIV60',0.00, 0.00, 'NASA Distinguished Service Medal', 'Awarded to individuals serving in any capacity with NASA or any other federal agency who distinguishes him/herself by service, ability, or courage, and has made a significant contribution to the NASA mission.'),
('CIV65',0.00, 0.00, 'NASA Flight Medal', 'Established in 1981, is presented only to crewmembers of Space Transportation System (Shuttle) flights that perform orbital missions in outer space. Considered in equal in precedence to the Exceptional Service Medal.'),
('CIV70',0.00, 0.00, 'NASA Medal for Exceptional Bravery', 'Established on Sept. 15, 1961. Awarded for exemplary and courageous handling of an emergency in NASA program activities, or for exemplary and courageous service in the performance of an official task of importance.'),
('CIV75',0.00, 0.00, 'NASA Medal for Exceptional Service', 'Authorized May 1, 1957. Awarded for significance in these areas\n-scientific achievement,\n-leadership in aeronautical science,\n-contribution to public administration,\n-and unusual courage in an emergency.\nOriginally inherited from NACA.'),
('CIV80',0.00, 0.00, 'Navy Distinguished Civilian Service Medal', 'Authorized by Congress on Feb. 4, 1919. Awarded to recognize any person serving in any capacity with the U.S. Navy who distinguishes him/herself by exeptionally meritorious service to the government in a duty of great responsibility.'),
('CIV85',0.00, 0.00, 'Navy Distinguished Achievement in Science', 'Established in Jan. 1961. Rewarding breakthroughs in science of value to the U.S. Navy. This decoration is gold.'),
('CIV90',0.00, 0.00, 'Navy Distinguished Public Service Award', 'This award is the highest recognition that the Secretary of the Navy may pay to a civilian. It is given to citizens of the U.S., not employed with the Navy who make special contributions bearing directly on the accomplishment of the navy''s mission.'),
('CIV100',0.00, 0.00, 'Selective Service Distinguished Service Award', 'This gold medal is awarded for extraordinary performance or contribution to the Selective Service System Administration.'),
('CIV105',0.00, 0.00, 'Selective Service Exceptional Service Award', 'This silver medal is awarded for exceptional service, and or improvements in system methods, or great acts of courage.'),
('CIV110',0.00, 0.00, 'Selective Service Meritorious Service Award', 'This bronze medal is awarded for exceptionally meritorious service and for significant achievements or inspiration to others which contributes to the goals of the Selective Service System.'),
('DOT1',0.00, 0.00, 'DOT Distinguished Service Medal', 'Awarded by the Secretary of Transportation to a member of the Coast Guard who has provided exceptionally meritorious service in a duty of great respondsibility.'),
('DOT3',0.00, 0.00, 'DOT Secretary''s Outstanding Achievement Medal', 'Awarded for outstanding leadership or other achievements as deemed appropriate.'),
('DOT5',0.00, 0.00, 'DOT Secretary''s Award for Meritorious Achievement', 'Awarded for completing assigned duties in an outstanding manner, developing new ideas or other contributions.'),
('DOT7',0.00, 0.00, 'DOT Superior Achievement Medal', 'Awarded for performance of assigned tasks in exemplary fashion, for unusual skillsor for improving work methods or for inventions which result in saving of manpower/time etc. Also in support of the department''s equal opportunities program.'),
('PH1', 9.00, 16.00, 'PHS Distinguished Service Medal', 'The highest Public Health Services Commissioned Corps award. Awarded for outstanding contributions to the mission of the Public Health Service, also awarded for one-time heroic act resulting in great savings of life, health or property.'),
('PH2', 9.00, 16.00, 'PHS Meritorious Service Medal', 'Awarded in recognition of meritorious service of a single, particularly important acheivement, a career notable for accomplishments in technical or professional fields or unusually high-quality and initiative in leadership.'),
('PH3', 9.00, 16.00, 'Surgeon General''s Exemplary Service Medal', 'No procedure exists, decision entirely up to the Surgeon General''s discretion.'),
('PH4', 9.00, 16.00, 'PHS Outstanding Service Medal', 'In recognition of continuous outstanding leadership in carrying out the mission of the Public Health Service.'),
('PH5', 9.00, 16.00, 'PHS Commendation Medal', 'Presented for a level of proficiency and dedication distinctly greater than that of the average officer.'),
('PH6', 9.00, 16.00, 'PHS Achievement Medal', 'Presented for excellence in accomplishing a programs mission.'),
('PH7', 9.00, 16.00, 'PHS Citation', 'Presented in recognition of a specific and noteworthy achievement, generally for a short period of time.'),
('PH7A', null, null, 'PHS Presidential Unit Citation', ''),
('PH8', null, null, 'PHS Outstanding Unit Citation', 'Awarded to officers of a unit that exhibits superior service towards achieving the goals and objectives of the Public Health Service.'),
('PH9', null, null, 'PHS Unit Commendation', 'Acknowledges an outstanding accomplishment by a designated organizational unitwithin the Public Health Service that has demonstrated a significant level of performance above that normally expected.'),
('PH9A', 9.00, 16.00, 'PHS Bicentennial Unit Comm', 'A service award given to officers on extended active duty during the Public Health Service bicentennial year (January 1, 1998-December 31, 1998).'),
('PH30', 9.00, 16.00, 'PHS Hazardous Duty Service Award', 'Awarded for 2.00 exposure hours over 180 consecutive days in a position requiring frequent risk to officers safety.'),
('PH31', 9.00, 16.00, 'PHS Foreign Duty Award', 'For service of 30 consecutive or 90 nonconsecutivedays in a foreign duty post(not in training status).'),
('PH32', 9.00, 16.00, 'PHS Special Assignment Service Award', 'For service of 30 consecutive days on detail to a special program initiative of other Federal or State agency.'),
('PH33', 9.00, 16.00, 'PHS Isolated Hardship Service Award', 'For service of over 180 consecutive days at a site designated as isolated, remote, insular or constituting a hardship.'),
('PH34', 9.00, 16.00, 'PHS Crisis Response Service Award', 'For service in the Public Health Service intervention activity in a crisis situation. Service must be direct/on-site participation of a non-routine nature. The Surgeon General declares this award.'),
('PH35', 9.00, 16.00, 'PHS National Emergency Preparedness Award', 'For serving two continuous years of service in an organized unit that is mandated to provide emergency medical/support services. Must also meet required activities, training, and certification.'),
('PH36', 9.00, 16.00, 'PHS Bicentennial Unit Commendation', 'A service award given to officers on extended active duty during the Public Health Service bicentennial year (January 1, 1998-December 31, 1998).'),
('PH37', null, null, 'PHS Smallpox Eradication Campaign Ribbon', 'Awarded to an officer who served a minimum of 90 days cumulative service between Jan. 1, 1966 - Oct. 26, 1977for the Center of Disease Control, the World Health Organizations Smallpox Eradication Program.'),
('PH37G', 9.00, 16.00, 'PHS Global Health Campaign', ''),
('PH37H', 9.00, 16.00, 'PHS Ebola Campaign', ''),
('PH38', null, null, 'PHS Regular Corps Ribbon', 'Awarded to all officers of the USPHS Commissioned Corps. Who hold a Regular Corps. Commission are authorized to wear this ribbon, must meet strict service and educational requirements.'),
('PH39', null, null, 'PHS Commissioned Corps Training Ribbon', 'Established to recognize PHS commissioned officers that complete both the Basic Officer Training Course and the Independent Officer Training Course.'),
('PH40', 9.00, 16.00, 'PHS Response', ''),
('PH41', 9.00, 16.00, 'PHS Global Response', ''),
('PH42', null, null, 'PHS Recruitment', ''),
('PH42G', 9.00, 16.00, 'PHS Global Health Initiative Service', ''),
('PH50', 9.00, 0.00, 'Commissioned Officer''s Association', 'Not technically part of the Public Health Service, but a voluntary association. This award recognizes membership in this association.'),
('PH51',0.00, 0.00, 'Association of Military Surgeons', 'Established Jan. 30, 1903 for members of the Association of Military Surgeons of the United States.'),
('PH52',0.00, 0.00, 'Reserve Officer''s Association', 'In recognition of membership in the Reserve Officers Association'),
('PH53',0.00, 0.00, 'Society of American Engineers', ''),
('NO1',0.00, 0.00, 'Department of Commerce Gold Medal', ''),
('NO2',0.00, 0.00, 'Department of Commerce Silver Medal', ''),
('NO3',0.00, 0.00, 'Department of Commerce Bronze Medal', ''),
('NO3A',0.00, 0.00, 'NOAA Meritorious Service Medal', ''),
('NO4',0.00, 0.00, 'NOAA Administrator''s Award Medal', ''),
('NO5',0.00, 0.00, 'NOAA Corps Commendation Medal', ''),
('NO6',0.00, 0.00, 'NOAA Special Achievement Medal', ''),
('NO7', null, null, 'NOAA Corps Director''s Award', ''),
('NO8', null, null, 'NOAA Unit Citation Award', ''),
('NO9',0.00, 0.00, 'NOAA ACO Awards Medal', ''),
('NO10',0.00, 0.00, 'Society of American Engineers Colbert Medal', ''),
('NO11', null, null, 'Society of American Engineers Karo Award Ribbon', ''),
('NO11C', null, null, 'NOAA Corps Sea Service Ribbon', ''),
('NO12', null, null, 'NOAA Corps Atlantic Service', ''),
('NO13', null, null, 'NOAA Corps Pacific Service', ''),
('NO14', null, null, 'NOAA Corps Mobile Duty Service', ''),
('NO15', null, null, 'NOAA Corps International Service', ''),
('NO16', null, null, 'NOAA Corps Rifle Ribbon (obsolete)', ''),
('NO17', null, null, 'NOAA Corps Pistol Ribbon (obsolete)', ''),
('MM1',0.00, 0.00, 'Merchant Marine Distinguished Service Medal', 'Established by Joint Resolution of Congress on Apr. 11, 1943. The highest award for Merchant Marine members. Awarded to seamen who distinguished themselves by outstanding conduct or service beyond the line of duty.'),
('MM2',0.00, 0.00, 'Merchant Marine Meritorious Service Medal', 'Authorized on Aug. 29, 1944 to recognize any member of the Merchant Marines regaurdless of grade or rate who distinguishes himself by outstanding meritorious service or achievement.'),
('MM3',0.00, 0.00, 'Merchant Marine Mariners Medal', 'Established by an Act of Congress on May 10, 1943 to recognize seamen who are killed or wounded as a direct result of conflict against an opposing armed force.'),
('MM3A', null, null, 'Merchant Marine Outstanding Achievement', 'This award recognizes outstanding achievement or service of an operational nature worthy of special recognition.'),
('MM4', null, null, 'Merchant Marine Gallant Ship Unit Citation', 'Authorized by Act of Congress May 10, 1943 and awarded to officers and seamen who served on a ship which at the time of service (Dec. 7, 1941- July 25, 1947) was cited for gallantry by the Administrator of the War Shipping Administration.'),
('MM5',0.00, 0.00, 'Merchant Marine Defense Bar', 'Authorized by Act of Congress May 10, 1943 and awarded for service in the U.S. Merchant Marine prior to Pearl Harbor (or between Sept. 8, 1939 to Dec. 7, 1941.'),
('MM6', null, null, 'Merchant Marine Combat Bar', 'Authorized by Act of Congress May 10, 1943 and awarded to Merchant Seamen who served on a ship which was attacked or damaged by an instrumentality of war between Dec. 7, 1941 to July 25, 1947.'),
('MM7',0.00, 0.00, 'Merchant Marine Atlantic War Zone Bar', 'Authorized by Act of Congress May 10, 1943 for crew members of ships operated by or for the War Shipping Administration who saw service in the Atlantic War Zone during the period from Dec. 7, 1941 to Nov. 8, 1945.'),
('MM8',0.00, 0.00, 'Merchant Marine Med / Mid East War Zone Bar', 'Authorized by Act of Congress May 10, 1943 and awarded to crew members of ships operated by or for the War Shipping Administration who served in Mediterranean or Middle East zones between Dec. 7, 1941 and November 8, 1945.'),
('MM9',0.00, 0.00, 'Merchant Marine Pacific War Zone Bar', 'Authorized by Act of Congress May 10, 1943 and awarded to crew members of the ships operated by or for the War Shipping Administration who served in the Pacific War Zone during the period between Dec. 7, 1941 and Mar. 2, 1946.'),
('MM10',0.00, 0.00, 'Merchant Marine WWII Victory Medal', 'Established on Aug. 8, 1946. Awarded for service for at least 30 days on any vessel flying the United States flag between Dec. 7, 1941 and Sept. 3, 1945.'),
('MM11',0.00, 0.00, 'Merchant Marine Korean Service Bar', 'Awarded for service between June 30, 1950 to Sept. 30, 1953 in waters adjacent to Korea.'),
('MM12',0.00, 0.00, 'Merchant Marine Vietnam Service Bar', 'Awaded to personnel for service on U.S. ships serving in waters in and adjacent to Vietnam.'),
('MM13',0.00, 0.00, 'Merchant Marine Expeditionary Med', 'Awarded for participation in military operations as designated by the Maritime Administrator.'),
('AX1', 9.00, null, 'CGAUX Distinguished Service Award', ''),
('AX1A', 9.00, null, 'CGAUX Legion of Merit', ''),
('AX2', 9.00, null, 'CGAUX Plaque of Merit', ''),
('AX2A', 9.00, null, 'CGAUX Meritorious Service Award', ''),
('AX3', 9.00, null, 'CGAUX Award of Operational Merit', ''),
('AX4', 9.00, null, 'CGAUX Commendation Award', ''),
('AX5', 9.00, null, 'CGAUX Achievement Award', ''),
('AX5B', 9.00, null, 'CGAUX Commandant''s Letter of Commendation', ''),
('AX5A', 9.00, null, 'CGAUX Sustained Service Award', ''),
('AX6A', 9.00, null, 'CGAUX Humanitarian Service Award', ''),
('AX6B',null, null, 'CGAUX Operational Excellence ''E'' Ribbon', ''),
('AX15', 9.00, null, 'CGAUX Recruiting Service Award', ''),
('AX7', null, null, 'CGAUX Specialty Training', ''),
('AX7A', null, null, 'CGAUX Marine Safety (Trident) Training', ''),
('AX8', 9.00, null, 'CGAUX Operations Program Ribbon', ''),
('AX10', 9.00, null, 'CGAUX Examiner Program Ribbon', ''),
('AX11', 9.00, null, 'CGAUX Instructor Program Ribbon', ''),
('AX11A',9.00, null, 'CGAUX Public Affairs Ribbon', ''),
('AX13', 9.00, null, 'CGAUX Membership Ribbon', ''),
('AX14', 9.00, null, 'CGAUX Flotilla Meritorious Achievement', ''),
('AX18', 9.00, null, 'CGAUX Operations Service', ''),
('AX16', 9.00, null, 'CGAUX Visitation Award', ''),
('AX17', 9.00, null, 'CGAUX Public Education Award', ''),
('Obsolete', null, null, 'Obsolete Ribbons past here', ''),
('AX6', null, null, 'CGAUX Group Action Award (obsolete)', ''),
('AX9', null, null, 'CGAUX Air Observer (obsolete)', ''),
('AX12', null, null, 'CGAUX Service Award (obsolete)', ''),
('AX19', null, null, 'CGAUX Flotilla One Achievement (obsolete)', ''),
('AX20', null, null, 'CGAUX Flotilla PEC (obsolete)', ''),
('AX21', null, null, 'CGAUX Flotilla Operations (obsolete)', ''),
('AX22', null, null, 'CGAUX Flotilla Member Training (obsolete)', ''),
('AX23', null, null, 'CGAUX Flotilla Growth (obsolete)', ''),
('AX24', null, null, 'CGAUX Flotilla Public Affairs (obsolete)', ''),
('C1',0.00, null, 'CAP Silver Medal of Valor', ''),
('C2',0.00, null, 'CAP Bronze Medal of Valor', ''),
('C3',0.00, null, 'CAP Distinguished Service Medal', ''),
('C4',0.00, null, 'CAP Exceptional Service Award', ''),
('C5',0.00, null, 'CAP Meritorious Service Award', ''),
('C6',0.00, null, 'CAP Commander''s Commendation', ''),
('C6C',0.00, null, 'CAP Achievement', ''),
('C7',0.00, null, 'CAP Lifesaving Award', ''),
('C7C',0.00, null, 'CAP National Commanders Unit Award', ''),
('C8',0.00, null, 'CAP Unit Citation Award', ''),
('C9',0.00, null, 'CAP Gill Robb Wilson Award', ''),
('C10',0.00, null, 'CAP Paul E Garber Award', ''),
('C11',0.00, null, 'CAP Grover Loening Award', ''),
('C12',0.00, null, 'CAP Leadership Award', ''),
('C13',0.00, null, 'CAP Membership Award', ''),
('C14',0.00, null, 'CAP A Scott Crossfield Award', ''),
('C15',0.00, null, 'CAP Gen Chuck Yaeger Award', ''),
('C16',0.00, null, 'CAP Gen Carl A Spaatz Award', ''),
('C17', null, null, 'CAP Ira C Eaker Award', ''),
('C18',0.00, null, 'CAP Amelia Earhart Award', ''),
('C19',0.00, null, 'CAP Gen Billy Mitchell Award', ''),
('C20', null, null, 'CAP Neil Armstrong Achievement', ''),
('C21', null, null, 'CAP Dr Robert H Goddard Achievement', ''),
('C22', null, null, 'CAP Gen Jimmy Doolittle Achievement', ''),
('C23', null, null, 'CAP Charles A Lindbergh Achievement', ''),
('C24', null, null, 'CAP Cpt Eddie Richenbacker Achievement', ''),
('C25', null, null, 'CAP Wright Brothers Achievement', ''),
('C25M', null, null,'CAP Mary Feik Achievement', ''),
('C26', null, null, 'CAP Gen Hap Arnold Achievement', ''),
('C27', null, null, 'CAP Gen J F Curry Achievement', ''),
('C28',0.00, null, 'CAP Command Service', ''),
('C29',0.00, null, 'CAP Red Service', ''),
('C30',0.00, null, 'CAP Search -Find-', ''),
('C31',0.00, null, 'CAP Search and Rescue', ''),
('C32', null, null, 'CAP Counterdrug', ''),
('C33',0.00, null, 'CAP Disaster Relief', ''),
('C33H',0.00, null, 'CAP Homeland Security Ribbon', ''),
('C34', null, null, 'CAP Cadet Community Service', ''),
('C35', null, null, 'CAP Cadet Orientation Pilot', ''),
('C36',0.00, null, 'CAP IACE', ''),
('C37',0.00, null, 'CAP National Cadet Competition', ''),
('C38', null, null, 'CAP National Color Guard Competition', ''),
('C39', null, null, 'CAP Cadet Advisory Council', ''),
('C40', null, null, 'CAP Cadet Special Activities', ''),
('C41',0.00, null, 'CAP Encampment', ''),
('C42',0.00, null, 'CAP Senior Recruiter', ''),
('C43', null, null, 'CAP Cadet Recruiter', ''),
('State',0.00, null, 'State Guard Ribbon', 'Put name in the comments section.');

CREATE TABLE public.base_prices
(
    id SERIAL UNIQUE,
    name character varying NOT NULL UNIQUE,
    price NUMERIC(8,2)
)
WITH (
OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.base_prices
    OWNER to postgres;
INSERT INTO base_prices (name, price)
VALUES
    ('ribbon', 1.75),
    ('device', 0.6),
    ('miniature_device', 0.6),
    ('attachment', 0.75),
    ('miniature_attachment', 0.75),
    ('magnetic_ribbons', 4),
    ('annodized_medal', 2),
    ('pin_tag', 4),
    ('magnetic_tag', 6);

-- View: public.devices_attachments_with_prices

-- DROP VIEW public.devices_attachments_with_prices;

CREATE OR REPLACE VIEW public.devices_attachments_with_prices AS
    SELECT a.id,
        a.image_name,
        a.description,
        a.type,
        a.breakafter,
        a.superimpose,
        b.price
    FROM devices_attachments a,
        base_prices b
    WHERE a.type::text = b.name::text;

ALTER TABLE public.devices_attachments_with_prices
    OWNER TO postgres;
