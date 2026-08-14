-- implement transactional ticket reassignments


-- begin transaction
BEGIN;

-- reassign ticket

UPDATE assignments                                                                     
SET user_id =1
WHERE ticket_id =4;

--- update ticket status

UPDATE tickets
SET status = 'in_progress'
WHERE ticket_id = 4;

SAVEPOINT reassigned;


-- deliberate error
UPDATE tickets 
SET status = 'unknown';


-- rollback to savepoint
ROLLBACK TO SAVEPOINT reassigned;


-- update status

INSERT INTO status_history (ticket_id , previous_status, new_status, updated_by) 
VALUES (4,'open','in_progress',1);



-- add comment

INSERT INTO comments
    (text,user_id,ticket_id)
    VALUES ('fixing connectivity issues', 1,4);


-- commit changes;
COMMIT;



-- before index 

EXPLAIN  select * from tickets where priority = 'high';

--                        QUERY PLAN                        
-- ---------------------------------------------------------
--  Seq Scan on tickets  (cost=0.00..1.05 rows=1 width=286)
--    Filter: ((priority)::text = 'high'::text)
-- (2 rows)


-- after indexing 

 create index idx_priority on tickets(priority);
-- CREATE INDEX

EXPLAIN select * from tickets where priority = 'high';

--                          QUERY PLAN                                  
-- ------------------------------------------------------------------------------
--  Index Scan using idx_priority on tickets  (cost=0.13..8.15 rows=1 width=286)
--    Index Cond: ((priority)::text = 'high'::text)
-- (2 rows)
