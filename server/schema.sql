CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    parsed_title TEXT,
    parsed_year INT,
    title TEXT,
    year INT,
    imdb_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tv_shows (
    id SERIAL PRIMARY KEY,
    parsed_title TEXT,
    title TEXT,
    imdb_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE seasons (
    id SERIAL PRIMARY KEY,
    show_id INT REFERENCES tv_shows(id) ON DELETE CASCADE,
    season_number INT,
    UNIQUE(show_id, season_number)
);

CREATE TABLE episodes (
    id SERIAL PRIMARY KEY,
    season_id INT REFERENCES seasons(id) ON DELETE CASCADE,
    episode_number INT,
    parsed_title TEXT,
    title TEXT,
    UNIQUE(season_id, episode_number)
);

CREATE TABLE media_files (
    id SERIAL PRIMARY KEY,
    file_path TEXT UNIQUE NOT NULL,
    movie_id INT REFERENCES movies(id) ON DELETE CASCADE,
    episode_id INT REFERENCES movies(id) ON DELETE CASCADE,
    parsed_title TEXT,
    parsed_year INT,
    parsed_season INT,
    parsed_episode INT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);