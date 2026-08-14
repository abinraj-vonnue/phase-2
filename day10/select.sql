-- currently activive bookings.
SELECT e.name ,b.status as booking_status,c.name  as customer_name , booked_at
FROM equipment e
JOIN bookings b
ON e.equipment_id = b.equipment_id
JOIN approvals a
ON a.approval_id = b.approval_id
JOIN customers  c 
ON a.customer_id = c.customer_id
WHERE   b.status ='dispatched';

-- equipments currently under maintenance

SELECT DISTINCT ON (e.equipment_id)
e.name as equipment , m.service_type, e.status
FROM equipment e
JOIN maintenance_records m
ON e.equipment_id = m.equipment_id
WHERE e.status = 'maintenance'
ORDER BY  e.equipment_id, m.serviced_at DESC;

-- total number of bookings made for each equipment category

SELECT c.name,e.category_id ,count(e.category_id) as total_booking
FROM equipment e
JOIN bookings b 
ON e.equipment_id = b.equipment_id
JOIN categories c
ON  e.category_id = c.category_id
GROUP BY e.category_id,c.name
ORDER BY total_bookings DESC;