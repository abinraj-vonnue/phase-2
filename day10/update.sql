-- return equipment  

BEGIN;

UPDATE bookings
SET status = 'returned',returned_at = CURRENT_TIMESTAMP
WHERE booking_id = 2;

UPDATE equipment
SET status = 'available'
WHERE equipment_id = (
    SELECT equipment_id 
    FROM bookings
    WHERE booking_id =2
)
COMMIT;


-- approve pending request




UPDATE approvals
SET status = 'approved',
approved_at = CURRENT_TIMESTAMP
WHERE approval_id = 4
AND status = 'pending';

