CREATE TABLE page_visits (
    id UUID NOT NULL,
    page_path VARCHAR(255) NOT NULL,
    resource_id UUID DEFAULT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    country VARCHAR(100) DEFAULT NULL,
    city VARCHAR(100) DEFAULT NULL,
    user_agent TEXT DEFAULT NULL,
    visited_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE INDEX idx_page_visits_visited_at ON page_visits (visited_at);

CREATE INDEX idx_page_visits_country ON page_visits (country);

CREATE INDEX idx_page_visits_page_path ON page_visits (page_path);