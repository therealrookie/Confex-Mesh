CREATE DATABASE perntodo;

CREATE TABLE todo(
    todo_id SERIAL PRIMARY KEY,
    description VARCHAR(255)
);

CREATE DATABASE confexmesh;

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    language VARCHAR(255)
);

CREATE TABLE players (
    player_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    input VARCHAR(255),
    sections JSONB,
    resolution VARCHAR(255),
    resource_handle VARCHAR(255)
);

CREATE TABLE matrices (
    matrix_id SERIAL PRIMARY KEY,
    timeline_handle BIGINT,
    name VARCHAR(255)
);

CREATE TABLE zones (
    zone_id SERIAL PRIMARY KEY,
    matrix_id INTEGER,
    player_id INTEGER,
    layer_handle BIGINT,
    pos_left VARCHAR(255),
    section VARCHAR(255)
);

CREATE TABLE helper (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    data VARCHAR(255)
)

INSERT INTO helper (name, data)
VALUES
(
    'IP Pixera four (main)',
    '10.10.10.109'
),
(
    'PORT Pixera four (main)',
    '1400'
),
(
    'IP Pixera four (backup)',
    '10.10.10.110'
),
(
    'PORT Pixera four (backup)',
    '1400'
),
(
    'IP Novastar (main)',
    '10.10.10.106'
),
(
    'PORT Novastar (main)',
    '8001'
),
(
    'IP Novastar (backup hot)',
    '10.10.10.107'
),
(
    'PORT Novastar (backup hot)',
    '8001'
),
(
    'IP Novastar (backup cold)',
    '10.10.10.108'
),
(
    'PORT Novastar (backup cold)',
    '8001'
);

DROP TABLE todo;


-- Inserting data for player 1
INSERT INTO players (name, input, sections, resolution, resource_handle)
VALUES
(
    'player 1',     
    'HDMI 1',   
    '{"1": "144:9"}'::JSONB,
    '7440x465',
    '0'
);

-- Inserting data for player 2
INSERT INTO players (name, input, sections, resolution, resource_handle)
VALUES
(
    'player 2',
    'HDMI 3',
    '{"1": "64:9", "2.1": "32:9", "2.2": "32:9", "4.1": "16:9", "4.2": "16:9", "4.3": "16:9", "4.4": "16:9"}'::JSONB,
    '3304x465',
    '0'
);

-- Inserting data for player 3
INSERT INTO players (name, input, sections, resolution, resource_handle)
VALUES
(
    'player 3',
    'HDMI 3',
    '{"1": "64:9", "2.1": "32:9", "2.2": "32:9", "4.1": "16:9", "4.2": "16:9", "4.3": "16:9", "4.4": "16:9"}'::JSONB,
    '3304x465',
    '0'
);

-- Inserting data for players 4 to 7
INSERT INTO players (name, input, sections, resolution, resource_handle)
VALUES
(
    'player 4',
    'SDI 1',
    '{"1": "32:9", "2.1": "16:9", "2.2": "16:9"}'::JSONB,
    '1652x465',
    '0'
),
(
    'player 5',
    'SDI 2',
    '{"1": "32:9", "2.1": "16:9", "2.2": "16:9"}'::JSONB,
    '1652x465',
    '0'
),
(
    'player 6',
    'SDI 3',
    '{"1": "32:9", "2.1": "16:9", "2.2": "16:9"}'::JSONB,
    '1652x465',
    '0'
),
(
    'player 7',
    'SDI 4',
    '{"1": "32:9", "2.1": "16:9", "2.2": "16:9"}'::JSONB,
    '1652x465',
    '0'
);

-- Inserting data for players 8 to 11
INSERT INTO players (name, input, sections, resolution, resource_handle)
VALUES
(
    'player 8',
    'SDI 5',
    '{"1": "16:9"}'::JSONB,
    '826x465',
    '0'
),
(
    'player 9',
    'SDI 6',
    '{"1": "16:9"}'::JSONB,
    '826x465',
    '0'
),
(
    'player 10',
    'SDI 7',
    '{"1": "16:9"}'::JSONB,
    '826x465',
    '0'
),
(
    'player 11',
    'SDI 8',
    '{"1": "16:9"}'::JSONB,
    '826x465',
    '0'
);


