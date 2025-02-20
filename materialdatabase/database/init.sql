-- Benutzer-Tabelle
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Materialien und Produkte Tabelle
CREATE TABLE materials_products (
    id VARCHAR(10) PRIMARY KEY,
    type VARCHAR(1) NOT NULL CHECK (type IN ('M', 'P')),
    name VARCHAR(255) NOT NULL,
    dimensions JSONB NOT NULL,
    manufacturer VARCHAR(255),
    lambda_value DECIMAL(10,4),
    mu_dry DECIMAL(10,4),
    mu_wet DECIMAL(10,4),
    sd_value DECIMAL(10,4),
    vkf_class VARCHAR(50),
    load_value DECIMAL(10,4),
    ubp_id VARCHAR(50),
    unit VARCHAR(20),
    price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- Übersetzungstabelle
CREATE TABLE translations (
    key VARCHAR(255) NOT NULL,
    de TEXT NOT NULL,
    en TEXT NOT NULL,
    PRIMARY KEY (key)
);

-- Index für Suche
CREATE INDEX idx_materials_products_name ON materials_products(name);
CREATE INDEX idx_materials_products_type ON materials_products(type);