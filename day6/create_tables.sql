CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE categories(
    category_id SERIAL PRIMARY KEY,
    category VARCHAR(50) UNIQUE NOT NULL
);
CREATE TABLE customers(
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULl
);
CREATE TABLE tickets(
    ticket_id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULl,
    description TEXT,
    status VARCHAR(20) NOT NULL,
    customer_id INT NOT NULl REFERENCES customers(customer_id) ,
    category_id INT NOT NULl REFERENCES categories(category_id) ,
    CHECK(
        status IN ('open','in_progress','resolved')
    )
);
CREATE TABLE comments(
    comment_id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    user_id INT REFERENCES users(user_id),
    customer_id INT REFERENCES customers(customer_id) ,
    ticket_id   INT  NOT NULl REFERENCES tickets(ticket_id),

    CHECK (
        (user_id IS NOT NULL AND customer_id IS NULL)
        OR 
        (user_id IS NULL AND customer_id IS NOT NULL)
    )
);
CREATE TABLE assignments(
    id SERIAL PRIMARY KEY,
    ticket_id  INT  NOT NULl REFERENCES tickets(ticket_id),
    user_id INT  NOT NULl REFERENCES users(user_id),
    UNIQUE ( ticket_id,user_id)
);
CREATE TABLE status_history(
    status_id SERIAL PRIMARY KEY,
    ticket_id INT  NOT NULl REFERENCES tickets(ticket_id),
    previous_status VARCHAR ,
    new_status VARCHAR NOT NULL ,
    updated_by INT  NOT NULl REFERENCES users(user_id) ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK(
        new_status IN ('open','in_progress','resolved')
    )
);