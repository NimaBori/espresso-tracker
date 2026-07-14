-- Seed default admin user
-- Password: admin123 (BCrypt encoded)
-- To generate a BCrypt hash for a different password, use the app's BCryptPasswordEncoder
INSERT INTO
    users (
        id,
        username,
        email,
        password,
        role
    )
VALUES (
        UUID_TO_BIN(
            'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
        ),
        'admin',
        'admin@espresso.com',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'ADMIN'
    )
ON DUPLICATE KEY UPDATE
    username = username;