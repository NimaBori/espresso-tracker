CREATE TABLE beans (
    id BINARY(16) NOT NULL,
    roaster_name VARCHAR(255) NOT NULL,
    bean_name VARCHAR(255) NOT NULL,
    origin VARCHAR(255),
    roast_level ENUM('LIGHT', 'MEDIUM', 'DARK'),
    tasting_notes TEXT,
    is_active BIT(1) NOT NULL DEFAULT 1,
    created_at DATETIME,
    PRIMARY KEY (id)
);

CREATE TABLE brew_logs (
    id BINARY(16) NOT NULL,
    bean_id BINARY(16) NOT NULL,
    dose_grams DOUBLE NOT NULL,
    yield_grams DOUBLE NOT NULL,
    extraction_time_seconds INT NOT NULL,
    grind_setting VARCHAR(255),
    rating INT,
    notes TEXT,
    created_at DATETIME,
    PRIMARY KEY (id),
    CONSTRAINT fk_brew_logs_bean FOREIGN KEY (bean_id) REFERENCES beans (id)
);