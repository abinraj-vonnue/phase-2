-- delete comments by arjun
delete from comments
where customer_id = (
    select customer_id from customers where name = 'Arjun'
);

-- remove assignment for ticket 4

delete from assignments
where ticket_id  = 4;


-- delete all resolved tickets and their related comments , assignments


delete from comments 
where ticket_id in (
    select ticket_id from tickets
    where status = 'resolved'
);
delete from assignments
where ticket_id in (
    select ticket_id from tickets
    where status = 'resolved'
);

delete from status_history
where ticket_id in (
    select ticket_id from tickets
    where status = 'resolved'
);
delete from tickets
where status = 'resolved'