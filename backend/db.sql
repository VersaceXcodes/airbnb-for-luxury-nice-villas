-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    display_name VARCHAR(255),
    role VARCHAR(50) NOT NULL CHECK (role IN ('guest', 'host', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Hosts table
CREATE TABLE IF NOT EXISTS hosts (
    user_id VARCHAR(255) PRIMARY KEY REFERENCES users(id),
    payout_schedule VARCHAR(50) DEFAULT 'weekly',
    onboarding_complete BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Villas table
CREATE TABLE IF NOT EXISTS villas (
    id VARCHAR(255) PRIMARY KEY,
    host_user_id VARCHAR(255) REFERENCES users(id),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location_data JSONB,
    bedrooms_total INTEGER,
    bathrooms_total INTEGER,
    max_guests INTEGER,
    max_pets INTEGER DEFAULT 0,
    policies JSONB,
    base_price_usd_per_night DECIMAL(10,2),
    cleaning_fee_usd DECIMAL(10,2),
    service_fee_ratio DECIMAL(5,4) DEFAULT 0.1,
    damage_waiver_ratio DECIMAL(5,4) DEFAULT 0.035,
    status VARCHAR(50) DEFAULT 'draft',
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(255) PRIMARY KEY,
    guest_user_id VARCHAR(255) REFERENCES users(id),
    villa_id VARCHAR(255) REFERENCES villas(id),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    adults INTEGER DEFAULT 0,
    children INTEGER DEFAULT 0,
    infants INTEGER DEFAULT 0,
    total_base_usd DECIMAL(10,2),
    total_fees_usd DECIMAL(10,2),
    total_taxes_usd DECIMAL(10,2),
    total_usd DECIMAL(10,2),
    balance_usd DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'confirmed', 'completed', 'cancelled')),
    payment_intent_id VARCHAR(255),
    contract_signed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Calendar events table
CREATE TABLE IF NOT EXISTS calendar_events (
    id VARCHAR(255) PRIMARY KEY,
    villa_id VARCHAR(255) REFERENCES villas(id),
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('booking', 'blocked', 'manual_hold')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    booking_id VARCHAR(255) REFERENCES bookings(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Guest reviews table
CREATE TABLE IF NOT EXISTS guest_reviews (
    id VARCHAR(255) PRIMARY KEY,
    booking_id VARCHAR(255) REFERENCES bookings(id),
    guest_user_id VARCHAR(255) REFERENCES users(id),
    villa_id VARCHAR(255) REFERENCES villas(id),
    ratings JSONB,
    content TEXT,
    photos JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loyalty credits table
CREATE TABLE IF NOT EXISTS loyalty_credits (
    id VARCHAR(255) PRIMARY KEY,
    guest_user_id VARCHAR(255) REFERENCES users(id),
    booking_id VARCHAR(255) REFERENCES bookings(id),
    amount_usd DECIMAL(10,2),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payouts table
CREATE TABLE IF NOT EXISTS payouts (
    id VARCHAR(255) PRIMARY KEY,
    host_user_id VARCHAR(255) REFERENCES users(id),
    amount_usd DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Moderation queues table
CREATE TABLE IF NOT EXISTS moderation_queues (
    id VARCHAR(255) PRIMARY KEY,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(255) PRIMARY KEY,
    booking_id VARCHAR(255) REFERENCES bookings(id),
    sender_user_id VARCHAR(255) REFERENCES users(id),
    body TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- File uploads table
CREATE TABLE IF NOT EXISTS file_uploads (
    id VARCHAR(255) PRIMARY KEY,
    uploader_user_id VARCHAR(255) REFERENCES users(id),
    purpose VARCHAR(255),
    file_url VARCHAR(500),
    mime_type VARCHAR(100),
    file_size_bytes INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Guidebooks table
CREATE TABLE IF NOT EXISTS guidebooks (
    id VARCHAR(255) PRIMARY KEY,
    villa_id VARCHAR(255) REFERENCES villas(id),
    content JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);