
-- reset db
DROP TABLE IF EXISTS maintenance_records CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS approvals CASCADE;
DROP TABLE IF EXISTS equipment CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS employees CASCADE;



-- create tables
CREATE TABLE employees(
    employee_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE    
);
CREATE TABLE customers(
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE    
);
CREATE TABLE categories(
    category_id SERIAL PRIMARY key,
    name VARCHAR(50) NOT NULL
);
CREATE TABLE equipment(
    equipment_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    category_id INT NOT NULL REFERENCES categories(category_id),
    status VARCHAR(20) NOT NULL,
    CHECK(
        status IN ('booked','available','maintenance')
    )
);
CREATE TABLE approvals(
    approval_id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL REFERENCES employees(employee_id),
    customer_id INT NOT NULL REFERENCES customers(customer_id),
    status VARCHAR(20) NOT NULL,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    approved_at TIMESTAMP ,
    CHECK(
        status IN ('approved','rejected','pending')
    )
);
CREATE TABLE bookings(
    booking_id SERIAL PRIMARY KEY,
    equipment_id INT NOT NULL REFERENCES equipment(equipment_id),
    approval_id INT NOT NULL UNIQUE REFERENCES approvals(approval_id),
    status VARCHAR(20) NOT NULL ,
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    returned_at TIMESTAMP ,
    deadline TIMESTAMP,
    CHECK(
        status IN ('dispatched','delivered','returned')
    ),
    CHECK(
        deadline IS NULL OR
        booked_at IS NULL OR
        deadline >= booked_at
    ),
    CHECK(
        returned_at IS NULL OR
        booked_at IS NULL OR 
        returned_at >= booked_at
    )
);
CREATE TABLE maintenance_records(
    record_id SERIAL PRIMARY KEY,
    equipment_id INT NOT NULL REFERENCES equipment(equipment_id),
    serviced_at TIMESTAMP,
    expiry_date TIMESTAMP,
    service_type VARCHAR(100),
    description VARCHAR(200),
    cost DECIMAL(10,2),
    CHECK (cost >=0),
    CHECK (expiry_date IS NULL OR serviced_at IS NULL OR expiry_date >= serviced_at)
);