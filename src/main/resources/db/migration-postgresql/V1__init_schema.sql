CREATE TABLE beans (
    id UUID NOT NULL,
    roaster_name VARCHAR(255) NOT NULL,
    bean_name VARCHAR(255) NOT NULL,
    origin VARCHAR(255),
    roast_level VARCHAR(20) CHECK (
        roast_level IN ('LIGHT', 'MEDIUM', 'DARK')
    ),
    tasting_notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE brew_logs (
    id UUID NOT NULL,
    bean_id UUID NOT NULL,
    dose_grams DOUBLE PRECISION NOT NULL,
    yield_grams DOUBLE PRECISION NOT NULL,
    extraction_time_seconds INT NOT NULL,
    grind_setting VARCHAR(255),
    rating INT,
    notes TEXT,
    created_at TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_brew_logs_bean FOREIGN KEY (bean_id) REFERENCES beans (id)
);