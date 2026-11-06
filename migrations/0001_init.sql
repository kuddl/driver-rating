-- Driver-Rating: Grundschema (Ticket #11, Entscheidungen aus #3, #6, #9, #10)

CREATE TABLE drivers (
  id   INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

INSERT INTO drivers (id, name) VALUES (1, 'Johanna');

CREATE TABLE trips (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  driver_id    INTEGER NOT NULL REFERENCES drivers(id),
  name         TEXT NOT NULL,
  destination  TEXT NOT NULL,       -- "Ziel"
  city         TEXT NOT NULL,       -- "Stadt"
  comment      TEXT,                -- optional
  date         TEXT NOT NULL,       -- YYYY-MM-DD, versteckt mitgeführt
  started_at   INTEGER NOT NULL,    -- Unix-Sekunden
  active_until INTEGER NOT NULL     -- started_at + 900 (15 Minuten, fest)
);

CREATE INDEX trips_driver_started ON trips (driver_id, started_at);

CREATE TABLE ratings (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  trip_id    INTEGER NOT NULL REFERENCES trips(id),
  created_at INTEGER NOT NULL,      -- Unix-Sekunden
  alias      TEXT NOT NULL,         -- Pseudonym, z. B. "Schwarzer Kater"
  icon       TEXT NOT NULL          -- Schlüssel für das Icon, z. B. "kater"
);

CREATE INDEX ratings_trip ON ratings (trip_id);

CREATE TABLE answers (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  rating_id   INTEGER NOT NULL REFERENCES ratings(id),
  question_id INTEGER NOT NULL,     -- ID im JSON-Fragenpool
  score       INTEGER NOT NULL CHECK (score BETWEEN 1 AND 3)  -- 1 😬, 2 😐, 3 😎
);

CREATE INDEX answers_rating ON answers (rating_id);
