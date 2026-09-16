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


-- 1. Treatment Centers (10 records)
INSERT INTO treatment_center (name, city, address, capacity_tons, opening_date, is_active) VALUES
('EcoRecycle Hub Paris Nord', 'Paris', '12 Rue de la Chapelle', 2500.00, '2018-03-15', TRUE),
('Centre de Tri de Lyon Gerland', 'Lyon', '45 Rue Marcel Mérieux', 1800.00, '2019-06-01', TRUE),
('Marseille Recyclage Littoral', 'Marseille', '8 Boulevard National', 2200.00, '2017-09-20', TRUE),
('Bordeaux Ouest Valorisation', 'Bordeaux', '19 Avenue de la Jallère', 1400.00, '2020-01-10', TRUE),
('Toulouse Sud Traitement Vert', 'Toulouse', '3 Rue Paulin Talabot', 1650.00, '2021-04-12', TRUE),
('Nantes Métropole Valorisation', 'Nantes', '77 Boulevard de la Prairie', 1300.00, '2020-11-05', TRUE),
('Lille Flandres Tri Moderne', 'Lille', '102 Rue Jean Jaurès', 1950.00, '2016-08-18', TRUE),
('Strasbourg Eco-Plaine', 'Strasbourg', '14 Route du Rhin', 1100.00, '2022-02-28', TRUE),
('Nice Provence Recyclage', 'Nice', '61 Corniche des Cévennes', 1250.00, '2019-10-14', TRUE),
('Rennes Bretagne Traitement', 'Rennes', '28 Rue de Lorient', 1500.00, '2021-07-01', TRUE);


-- 2. Waste Types (10 records)
INSERT INTO waste_type (label, category, is_recyclable, price_per_ton, color_code) VALUES
('PET Plastic Bottles', 'plastic', TRUE, 220.00, '#00A86B'),
('Clear Glass Bottles & Jars', 'glass', TRUE, 85.00, '#2E8B57'),
('Corrugated Cardboard', 'cardboard', TRUE, 140.00, '#8B5A2B'),
('Office & Newsprint Paper', 'paper', TRUE, 110.00, '#4682B4'),
('Aluminium Beverage Cans', 'metal', TRUE, 950.00, '#708090'),
('Organic Food Scraps', 'organic', TRUE, 45.00, '#556B2F'),
('Household Batteries & Accus', 'hazardous', TRUE, 600.00, '#B22222'),
('Used Textiles & Garments', 'textile', TRUE, 180.00, '#9370DB'),
('Electronic Small Appliances', 'electronic', TRUE, 420.00, '#FF8C00'),
('Non-Recyclable Residual Waste', 'other', FALSE, 25.00, '#2F4F4F');


-- 3. Collection Points (10 records)
INSERT INTO collection_point (name, point_type, address, city, latitude, longitude, center_id) VALUES
('Place de la République Eco-Point', 'street_bin', '1 Place de la République', 'Paris', 48.867566, 2.363843, 1),
('Gare de Lyon Drop-off Point', 'drop_off_center', 'Pl. Louis-Armand', 'Paris', 48.844304, 2.374377, 1),
('Bellecour Containers', 'container', 'Place Bellecour', 'Lyon', 45.757814, 4.832011, 2),
('Vieux Port Tri Urbain', 'street_bin', '34 Quai des Belges', 'Marseille', 43.295251, 5.374491, 3),
('Prado Drop Center', 'drop_off_center', '120 Avenue du Prado', 'Marseille', 43.272110, 5.388920, 3),
('Quinconces Eco-Hub', 'container', 'Place des Quinconces', 'Bordeaux', 44.845800, -0.573900, 4),
('Capitole Eco-Point', 'street_bin', 'Place du Capitole', 'Toulouse', 43.604652, 1.444209, 5),
('Commerce Drop-off Zone', 'drop_off_center', 'Place du Commerce', 'Nantes', 47.213300, -1.558300, 6),
('Grand Place Tri Collectif', 'container', 'Grand Place', 'Lille', 50.636900, 3.063300, 7),
('Kleber Green Spot', 'street_bin', 'Place Kléber', 'Strasbourg', 48.583400, 7.745500, 8);


-- 4. Collections / Truck Runs (10 records)
INSERT INTO collection (point_id, center_id, collection_date, vehicle_plate, driver_name, status) VALUES
(1, 1, '2026-09-01', 'AB-123-CD', 'Marc Dupont', 'completed'),
(2, 1, '2026-09-02', 'AB-123-CD', 'Marc Dupont', 'completed'),
(3, 2, '2026-09-03', 'EF-456-GH', 'Claire Vasseur', 'completed'),
(4, 3, '2026-09-04', 'IJ-789-KL', 'Karim Benali', 'completed'),
(5, 3, '2026-09-05', 'IJ-789-KL', 'Karim Benali', 'completed'),
(6, 4, '2026-09-06', 'MN-012-OP', 'Sophie Martin', 'completed'),
(7, 5, '2026-09-07', 'QR-345-ST', 'Lucas Mercier', 'completed'),
(8, 6, '2026-09-08', 'UV-678-WX', 'Julien Moreau', 'in_progress'),
(9, 7, '2026-09-09', 'YZ-901-AB', 'Thomas Leroux', 'planned'),
(10, 8, '2026-09-10', 'CD-234-EF', 'Nicolas Petit', 'planned');


-- 5. Collection Waste / Weighing Details (12 records)
INSERT INTO collection_waste (collection_id, waste_type_id, quantity_kg, is_sorted) VALUES
(1, 1, 350.50, TRUE),   -- Paris run 1: PET Plastic
(1, 3, 520.00, TRUE),   -- Paris run 1: Cardboard
(2, 2, 890.00, TRUE),   -- Paris run 2: Glass
(2, 10, 410.00, FALSE), -- Paris run 2: Residual non-recyclable
(3, 1, 280.00, TRUE),   -- Lyon run 3: PET Plastic
(3, 5, 145.20, TRUE),   -- Lyon run 3: Aluminium cans
(4, 2, 750.00, TRUE),   -- Marseille run 4: Glass
(4, 4, 310.00, TRUE),   -- Marseille run 4: Paper
(5, 6, 620.00, TRUE),   -- Marseille run 5: Organic waste
(6, 3, 480.00, TRUE),   -- Bordeaux run 6: Cardboard
(7, 1, 210.00, TRUE),   -- Toulouse run 7: Plastic
(7, 9, 115.00, TRUE);   -- Toulouse run 7: Electronics
