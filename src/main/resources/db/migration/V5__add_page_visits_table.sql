CREATE TABLE `page_visits` (
    `id` BINARY(16) NOT NULL,
    `page_path` VARCHAR(255) NOT NULL,
    `resource_id` BINARY(16) DEFAULT NULL,
    `ip_address` VARCHAR(45) DEFAULT NULL,
    `country` VARCHAR(100) DEFAULT NULL,
    `city` VARCHAR(100) DEFAULT NULL,
    `user_agent` TEXT DEFAULT NULL,
    `visited_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_page_visits_visited_at` (`visited_at`),
    INDEX `idx_page_visits_country` (`country`),
    INDEX `idx_page_visits_page_path` (`page_path`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;