-- assign all open tickets in network issue category to Riyas
UPDATE assignments
SET user_id = (
    SELECT user_id 
    FROM users
    WHERE name = 'Riyas'
)
WHERE ticket_id IN (
    SELECT t.ticket_id
    FROM tickets t
    JOIN categories c
    ON t.category_id = c.category_id
    WHERE t.status ='open'
    AND c.category = 'Network Issue'
)

-- Reassign every ticket currently assigned to Rohith to Rahul.

UPDATE assignments
SET user_id = (
    SELECT user_id
    FROM users
    WHERE name = 'Rahul'
)
WHERE user_id = (
    SELECT user_id
    FROM users
    WHERE name  ='Rohith'
);

-- Change all tickets in the Software Bug category that are still open to in_progress.

UPDATE tickets
SET status = 'in_progress'
WHERE category_id = (
    SELECT category_id 
    FROM categories
    WHERE category = 'Software Bug'
) AND status = 'open';


-- For customers who have more than one ticket, mark all of their open tickets as in_progress.

UPDATE tickets
set status = 'in_progress'
WHERE status = 'open'
    AND customer_id IN (
        select customer_id 
        from tickets
        group by customer_id
        having count(ticket_id) > 1
    ) ;