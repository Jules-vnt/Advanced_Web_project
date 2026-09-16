DROP DATABASE IF EXISTS recycling;

CREATE DATABASE recycling
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE recycling;


-- Treatment centers
CREATE TABLE treatment_center (
  center_id     INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  city          VARCHAR(100) NOT NULL,
  address       VARCHAR(150),
  capacity_tons DECIMAL(10,2) NOT NULL DEFAULT 0,
  opening_date  DATE,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE
);


-- Waste types
CREATE TABLE waste_type (
  waste_type_id INT AUTO_INCREMENT PRIMARY KEY,
  label         VARCHAR(80) NOT NULL,
  category      ENUM('plastic','glass','paper','cardboard','metal',
                     'organic','electronic','textile','hazardous','other') NOT NULL,
  is_recyclable BOOLEAN NOT NULL DEFAULT TRUE,
  price_per_ton DECIMAL(8,2) NOT NULL DEFAULT 0,
  color_code    CHAR(7)
);


-- Collection points
CREATE TABLE collection_point (
  point_id   INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  point_type ENUM('street_bin','drop_off_center','container','business') NOT NULL,
  address    VARCHAR(150),
  city       VARCHAR(80) NOT NULL,
  latitude   DECIMAL(9,6),
  longitude  DECIMAL(9,6),
  center_id  INT,
  CONSTRAINT fk_point_center
    FOREIGN KEY (center_id) REFERENCES treatment_center(center_id)
    ON DELETE SET NULL
);


-- Collection runs
CREATE TABLE collection (
  collection_id   INT AUTO_INCREMENT PRIMARY KEY,
  point_id        INT NOT NULL,
  center_id       INT NOT NULL,
  collection_date DATE NOT NULL,
  vehicle_plate   VARCHAR(15),
  driver_name     VARCHAR(100),
  status          ENUM('planned','in_progress','completed','cancelled')
                    NOT NULL DEFAULT 'planned',
  CONSTRAINT fk_collection_point
    FOREIGN KEY (point_id) REFERENCES collection_point(point_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_collection_center
    FOREIGN KEY (center_id) REFERENCES treatment_center(center_id)
    ON DELETE RESTRICT
);


-- Link table between collection and waste_type
CREATE TABLE collection_waste (
  collection_id INT NOT NULL,
  waste_type_id INT NOT NULL,
  quantity_kg   DECIMAL(10,2) NOT NULL,
  is_sorted     BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (collection_id, waste_type_id),
  CONSTRAINT fk_cw_collection
    FOREIGN KEY (collection_id) REFERENCES collection(collection_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_cw_waste
    FOREIGN KEY (waste_type_id) REFERENCES waste_type(waste_type_id)
    ON DELETE RESTRICT
);


