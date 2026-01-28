-- Spatial Database Schema for Public Transport GIS
-- Optimized for MySQL / MariaDB (phpMyAdmin)

-- 1. Create Tables with Spatial Support
CREATE TABLE IF NOT EXISTS `bus_stop` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `stop_id` VARCHAR(20) NOT NULL UNIQUE,
    `stop_name` VARCHAR(100) NOT NULL,
    `geom` POINT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    SPATIAL INDEX(`geom`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `bus_route` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `route_id` VARCHAR(20) NOT NULL UNIQUE,
    `route_name` VARCHAR(100) NOT NULL,
    `route_color` VARCHAR(7) DEFAULT '#2563eb',
    `geom` LINESTRING NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    SPATIAL INDEX(`geom`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Relation Table (Route to Stops)
CREATE TABLE IF NOT EXISTS `route_stop_mapping` (
    `route_id` VARCHAR(20),
    `stop_id` VARCHAR(20),
    `stop_order` INT,
    PRIMARY KEY (`route_id`, `stop_id`),
    FOREIGN KEY (`route_id`) REFERENCES `bus_route`(`route_id`) ON DELETE CASCADE,
    FOREIGN KEY (`stop_id`) REFERENCES `bus_stop`(`stop_id`) ON DELETE CASCADE
);

-- Note: Ensure you are using MySQL 5.7+ or MariaDB 10.2+ for SPATIAL INDEX support on InnoDB.
-- To insert data from QGIS, use the "Export to MySQL" tool or export to CSV and import via phpMyAdmin.
