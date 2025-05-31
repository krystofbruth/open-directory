CREATE DATABASE opendirectory;

\c opendirectory

-- Users table setup
CREATE TABLE users (
    userid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL
);

-- Sessions table setup 
CREATE TABLE session (
    token TEXT PRIMARY KEY,
    userid UUID NOT NULL,
    created TIMESTAMP,
    CONSTRAINT fk_user
        FOREIGN KEY(userid)
        REFERENCES users(userid)
        ON DELETE CASCADE
);
