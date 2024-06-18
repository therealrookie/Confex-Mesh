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
    id SERIAL PRIMARY KEY,
    name TEXT,
    input JSONB,
    zones JSONB,
    resolution TEXT,
    handle JSONB,
    resid JSONB
);

CREATE TABLE timelines (
    handle BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE layers (
    handle BIGINT PRIMARY KEY,
    timeline_handle BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    pos_left NUMERIC(10, 5),
    width NUMERIC(10, 5),
    player TEXT NOT NULL,
    zone TEXT NOT NULL
);

-- Inserting data for player 1
INSERT INTO players (name, input, zones, resolution, handle, resid)
VALUES
(
    'player 1',
    '["HDMI 1", "HDMI 2"]'::JSONB,
    '{"1": "144:9"}'::JSONB,
    '',
    '[0, 0]'::JSONB,
    '[0, 0]'::JSONB
);

-- Inserting data for player 2
INSERT INTO players (name, input, zones, resolution, handle, resid)
VALUES
(
    'player 2',
    '["HDMI 3"]'::JSONB,
    '{"1": "64:9", "2.1": "32:9", "2.2": "32:9", "4.1": "16:9", "4.2": "16:9", "4.3": "16:9", "4.4": "16:9"}'::JSONB,
    '',
    '0'::JSONB,
    '0'::JSONB
);

-- Inserting data for player 3
INSERT INTO players (name, input, zones, resolution, handle, resid)
VALUES
(
    'player 3',
    '["HDMI 4"]'::JSONB,
    '{"1": "64:9", "2.1": "32:9", "2.2": "32:9", "4.1": "16:9", "4.2": "16:9", "4.3": "16:9", "4.4": "16:9"}'::JSONB,
    '',
    '0'::JSONB,
    '0'::JSONB
);

-- Inserting data for players 4 to 7 (similar structure)
INSERT INTO players (name, input, zones, resolution, handle, resid)
VALUES
(
    'player 4',
    '["SDI 1"]'::JSONB,
    '{"1": "32:9", "2.1": "16:9", "2.2": "16:9"}'::JSONB,
    '',
    '0'::JSONB,
    '0'::JSONB
),
(
    'player 5',
    '["SDI 2"]'::JSONB,
    '{"1": "32:9", "2.1": "16:9", "2.2": "16:9"}'::JSONB,
    '',
    '0'::JSONB,
    '0'::JSONB
),
(
    'player 6',
    '["SDI 3"]'::JSONB,
    '{"1": "32:9", "2.1": "16:9", "2.2": "16:9"}'::JSONB,
    '',
    '0'::JSONB,
    '0'::JSONB
),
(
    'player 7',
    '["SDI 4"]'::JSONB,
    '{"1": "32:9", "2.1": "16:9", "2.2": "16:9"}'::JSONB,
    '',
    '0'::JSONB,
    '0'::JSONB
);

-- Inserting data for players 8 to 11 (similar structure, simpler zones)
INSERT INTO players (name, input, zones, resolution, handle, resid)
VALUES
(
    'player 8',
    '["SDI 5"]'::JSONB,
    '{"1": "16:9"}'::JSONB,
    '',
    '0'::JSONB,
    '0'::JSONB
),
(
    'player 9',
    '["SDI 6"]'::JSONB,
    '{"1": "16:9"}'::JSONB,
    '',
    '0'::JSONB,
    '0'::JSONB
),
(
    'player 10',
    '["SDI 7"]'::JSONB,
    '{"1": "16:9"}'::JSONB,
    '',
    '0'::JSONB,
    '0'::JSONB
),
(
    'player 11',
    '["SDI 8"]'::JSONB,
    '{"1": "16:9"}'::JSONB,
    '',
    '0'::JSONB,
    '0'::JSONB
);


