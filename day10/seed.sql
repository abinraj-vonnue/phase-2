TRUNCATE TABLE
    maintenance_records,
    bookings,
    approvals,
    equipment,
    categories,
    customers,
    employees
RESTART IDENTITY CASCADE;

BEGIN;
-- employees
INSERT INTO employees(name,email) VALUES
('Rohith' , 'rohith@mail.com'),
('Rahul' , 'rahul@mail.com'),
('Rohan' , 'rohan@mail.com'),
('Riswan' , 'riswan@mail.com');

-- customers

INSERT INTO customers (name,email) VALUES
('Arjun' , 'arjun@mail.com'),
('Akshay' , 'akshay@mail.com'),
('Arun' , 'arun@mail.com'),
('Akash' , 'akash@mail.com');

-- categories
INSERT INTO categories (name) VALUES
('Laptop'),
('Projector'),
('Camera'),
('Audio Device');


-- Equipments

INSERT INTO equipment (name, category_id,status) VALUES
('laptop x' , 1, 'available'),
('Canon Printer', 2, 'booked'),
('Sony cam ' , 3, 'maintenance'),
('JBL speaker' , 4, 'available');


-- approvals

INSERT INTO approvals (employee_id,customer_id,status,requested_at,approved_at) VALUES
(1,1,'approved','2026-08-10 09:00:00','2026-08-10 9:30:00'),
(2,2,'approved','2026-08-11 10:00:00','2026-08-11 10:30:00'),
(2,3,'rejected','2026-08-13 12:00:00',NULL),
(3,3,'approved', '2026-08-12 11:00:00','2026-08-12 11:30:00'),
(2,2,'approved','2026-08-13 12:00:00','2026-08-13 12:30:00');


-- bookings

INSERT INTO bookings (equipment_id, approval_id,status, booked_at,returned_at,deadline) VALUES
(1, 1, 'returned',  '2026-08-10 10:00:00', '2026-08-12 16:00:00', '2026-08-12 17:00:00'),
(2, 2, 'delivered', '2026-08-11 11:00:00', NULL,                  '2026-08-15 17:00:00'),
(3, 3, 'returned',  '2026-08-13 15:00:00', '2026-08-13 18:00:00', '2026-08-14 17:00:00'),
(4, 4, 'dispatched','2026-08-12 12:00:00', NULL,                  '2026-08-16 17:00:00');



-- Maintenance Records
INSERT INTO maintenance_records(equipment_id,serviced_at, expiry_date, service_type, description,cost) VALUES
(3, '2026-08-01 09:00:00', '2027-08-01 09:00:00', 'Sensor Cleaning', 'Cleaned camera sensor', 1200.00),
(2, '2026-07-15 10:00:00', '2027-07-15 10:00:00', 'Cleaned Body', 'Cleaned Body', 3500.00),
(1, '2026-06-20 11:00:00', '2027-06-20 11:00:00', 'Battery Check', 'Battery health inspection.', 800.00),
(4, '2026-05-10 14:00:00', '2027-05-10 14:00:00', 'Speaker Cleaning', 'checked audio outputs', 500.00);

COMMIT;