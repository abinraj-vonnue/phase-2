INSERT INTO users (name,email) VALUES
    ('Rahul','rahul@mail.com'),
    ('Rohith','rohith@mail.com'),
    ('Rohan','rohan@mail.com'),
    ('Rishan','rishan@mail.com'),
    ('Riyas','riyas@mail.com');


INSERT INTO categories(category) VALUES
    ('Billing'),
    ('Technical Support'),
    ('Password Reset'),
    ('Software Bug'),
    ('Network Issue');

INSERT INTO customers (name,email) VALUES
    ('Arjun','arjun@mail.com'),
    ('Akash','akash@mail.com'),
    ('Aromal','aromal@mail.com'),
    ('Amen','amen@mail.com');

INSERT INTO tickets (title,description,status,priority,customer_id,category_id) VALUES
    ('Payment failed', 'Payment not processed.', 'open', 'high', 1, 1),
    ('App crashes', 'App closes on login.', 'in_progress', 'high', 2, 4),
    ('Forgot password', 'Reset link not working.', 'resolved', 'medium', 3, 3),
    ('Wi-Fi issue', 'Connection keeps dropping.', 'open', 'low', 4, 5);


INSERT INTO comments (text,user_id,customer_id,ticket_id) VALUES
    ('Payment still pending' ,NULL,1,1),
    ('Looking into the issue.', 1, NULL, 1),
    ('Please try again.', 2, NULL, 2),
    ('Reset link received.', NULL, 3, 3),
    ('Network team notified.', 5, NULL, 4);


INSERT INTO assignments (ticket_id,user_id) VALUES 
    (1,1),
    (2,2),
    (3,3),
    (4,5);
INSERT INTO status_history (ticket_id,previous_status,new_status,updated_by) VALUES
    (1, NULL, 'open', 1),
    (2, 'open', 'in_progress', 2),
    (3, NULL, 'open', 3),
    (3, 'open', 'in_progress', 3),
    (3, 'in_progress', 'resolved', 3),
    (4, NULL, 'open', 5);
