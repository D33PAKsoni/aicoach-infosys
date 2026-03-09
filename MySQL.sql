CREATE DATABASE aicoach_db;
CREATE TABLE aicoach_db.users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    email VARCHAR(255) UNIQUE NOT NULL,
	google_id VARCHAR(255) UNIQUE,
	password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE aicoach_db.interview_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    session_uuid VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE
);

CREATE TABLE aicoach_db.resumes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(355) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE aicoach_db.interview_turns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    wpm INT,
    accuracy FLOAT,
    fillers VARCHAR(255),
    dominant_behavior VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_session 
        FOREIGN KEY (session_id) 
        REFERENCES interview_sessions(id) 
        ON DELETE CASCADE
);

CREATE TABLE interview_slots (
    id INT PRIMARY KEY,
    user_id INT NULL,
    session_uuid VARCHAR(255) NULL,
    start_time TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_user_slot FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO interview_slots (id, is_active) VALUES (1, FALSE), (2, FALSE);