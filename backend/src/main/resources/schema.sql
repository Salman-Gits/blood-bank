-- Blood Bank Database Schema for MySQL 8.0

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blood_inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    blood_group VARCHAR(10) NOT NULL UNIQUE,
    units_available INT NOT NULL DEFAULT 0,
    reserved_units INT NOT NULL DEFAULT 0,
    critical_threshold INT NOT NULL DEFAULT 5,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS donors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    blood_group VARCHAR(10) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    age INT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    city VARCHAR(50) NOT NULL,
    district VARCHAR(50),
    address VARCHAR(255),
    last_donated_date DATE,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    total_donations INT NOT NULL DEFAULT 1,
    verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blood_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tracking_code VARCHAR(30) NOT NULL UNIQUE,
    patient_name VARCHAR(100) NOT NULL,
    blood_group VARCHAR(10) NOT NULL,
    units_required INT NOT NULL DEFAULT 1,
    hospital_name VARCHAR(150) NOT NULL,
    city VARCHAR(50) NOT NULL,
    district VARCHAR(50),
    contact_person VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    urgency VARCHAR(20) NOT NULL DEFAULT 'NORMAL',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    required_date DATE,
    medical_reason TEXT,
    admin_remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
