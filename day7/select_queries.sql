-- select open tickets
SELECT ticket_id,title,status 
FROM tickets
WHERE status='open';

-- list tickets in specific category

SELECT  t.title,t.status, c.category_id , c.category
FROM tickets t
JOIN categories c
ON t.category_id = c.category_id 
WHERE c.category = 'Network Issue';


-- Show tickets raised by Arjun.
SELECT t.title,c.name,t.status
FROM tickets t
JOIN customers c
ON t.customer_id = c.customer_id
WHERE c.name ='Arjun';

-- Display all users ordered by name (A–Z).

SELECT *
FROM users
ORDER BY name ;

-- Display customers ordered by name in descending order.

SELECT *
FROM customers
ORDER BY name 
DESC;

-- Show the 2 most recent status history records.
SELECT * 
FROM status_history
ORDER BY created_at
DESC
LIMIT 2;

-- Show the first 3 tickets ordered by ticket_id.
SELECT * 
FROM tickets
ORDER BY ticket_id
LIMIT 3;

-- List comments for ticket 1 ordered by comment_id.
SELECT   c.text
FROM tickets t
JOIN comments c
ON t.ticket_id = c.ticket_id
WHERE t.ticket_id=1
ORDER BY comment_id;

-- Show the names of users assigned to tickets, ordered by user_id.
SELECT u.name
FROM users u
JOIN assignments a
ON u.user_id = a.user_id
ORDER BY u.user_id;

-- Show the latest status update for ticket 3 using ORDER BY and LIMIT 1

SELECT * 
FROM status_history
WHERE ticket_id=3
ORDER BY created_at,status_id
DESC
LIMIT 3;

-- SELECT tickets with high priority 


SELECT * 
FROM tickets
WHERE priority = 'high';