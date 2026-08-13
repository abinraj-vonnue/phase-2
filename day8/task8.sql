-- ticket count by status and assignee

SELECT u.name AS assignee, t.status COUNT(t.ticket_id) AS ticket_count
FROM tickets t
JOIN assignments a ON t.ticket_id = a.ticket_id
JOIN users u On a.user_id = u.user_id
GROUP BY u.name , t.status;

-- customers with more than five open tickets

SELECT c.name,count(t.ticket_id)
FROM customers c
JOIN  tickets t
ON c.customer_id = t.customer_id
where t.status = 'open'
GROUP BY c.customer_id
HAVING count(t.ticket_id) > 5;

-- users with no assigned tickets

SELECT name 
FROM users
WHERE user_id NOT IN (
    SELECT user_id from assignments
);

-- oldest unresolved ticket

SELECT ticket_id , title 
FROM tickets 
WHERE status NOT IN ('open' 'in_progress')
ORDER BY created_at
ASC
LIMIT 1;


-- Counts by category and priority 

SELECT c.category,t.priority, COUNT(t.ticket_id) AS ticket_count
FROM tickets t 
JOIN categories c
ON t.category_id = c.category_id
GROUP BY c.category ,t.priority;

