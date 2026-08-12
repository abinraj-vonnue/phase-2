# Support Ticket API

A file-backed support ticket API

## 1. Tech Stack

- node
- typescript
- jest

## 2. Project Structure

```bash
├── /(root)
   ├── day5/
   │   ├── README.md
   │   ├── index.ts
   │   ├── app.ts
   │   ├── controllers/
   │   │        ├── ticketManager.ts
   │   ├── helpers/
   │            ├── typeGuard.ts
   │
   ├── data/
   │     ├── tickets.json
   │
   ├── .gitignore
   ├── jest.config.js
   ├── README.md
   ├── package.json
   ├── tsconfig.json

```

## 3. Data Model

#### Ticket

```text
{
    id          : string,
    title       : string,
    description : string,
    assignee    : string,
    priority    : "high" | "low" | "medium"
    status      : "pending" | "completed"

}

```

#### example

```json
{
    "id": "1",
    "title": "reset api  Limit",
    "description": "Exceeded api limit",
    "assignee": "Rahul",
    "priority": "high",
    "status": "pending"
}
```

## 4. API endpoints

1.  ### Create Tickets

    `POST /tickets`
    - creates a new support ticket

    #### Example

    ```bash
    curl -X POST \
    --json '{
        "title": "reset api  Limit",
        "description": "Exceeded api limit",
        "assignee": "Rahul",
        "priority": "high",
        "status": "pending"
    }' \
    http://localhost:8080/tickets

    ```

    #### Request Body

    ```json
    {
        "title": "reset api  Limit",
        "description": "Exceeded api limit",
        "assignee": "Rahul",
        "priority": "high",
        "status": "pending"
    }
    ```

    #### Response

    ```json
    { "message": "successfully created ticket" }
    ```

    #### Error Response

    ```json
    {
        "error": "Bad request"
    }
    ```

1.  ### List Tickets

    `GET /tickets`
    - list all the tickets

    #### Example

    ```bash
    curl  http://localhost:8080/tickets

    ```

    #### Success Response

    ```json
    [
        {
            "id": "1",
            "title": "reset api  Limit",
            "description": "Exceeded api limit",
            "assignee": "Rahul",
            "priority": "high",
            "status": "completed"
        },
        {
            "id": "2",
            "title": "Generate new otp",
            "description": "otp required for signing in",
            "assignee": "Rahul",
            "priority": "high",
            "status": "pending"
        }
    ]
    ```

1.  ### View Ticket

    `GET /tickets/:id`
    - view ticket with specified ID

    #### Parameters
    - `id` - id of the ticket

    #### Example

    ```bash
    curl  http://localhost:8080/tickets/1

    ```

    #### Success Response

    ```json
    {
        "id": "1",
        "title": "reset api  Limit",
        "description": "Exceeded api limit",
        "assignee": "Rahul",
        "priority": "high",
        "status": "completed"
    }
    ```

    #### Error Response

    ```json
    {
        "error": "Ticket not found"
    }
    ```

1.  ### Update Status

    `PATCH /tickets/:id/status`
    - update status of ticket with specified ID

    #### Parameters
    - `id` - id of the ticket

    #### Example

    ```bash
    curl -X PATCH \
    --json '{"status": "completed" }' \
    http://localhost:8080/tickets/1/status

    ```

    #### Request Body

    ```json
    {
        "status": "completed"
    }
    ```

    #### Success Response

    ```json
    {
        "message": "successfully updated status"
    }
    ```

    #### Error Response

    ```json
    {
        "error": "Bad request"
    }
    ```

1.  ### Assign Ticket

    `PATCH /tickets/:id/assign`
    - assign ticket with specified id

    #### Parameters
    - `id` - id of the ticket

    #### Example

    ```bash
    curl -X PATCH \
    --json '{"assignee": "Rahul" }' \
    http://localhost:8080/tickets/1/assign

    ```

    #### Request Body

    ```json
    {
        "assignee": "Rahul"
    }
    ```

    #### Success Response

    ```json
    {
        "message": "successfully assigned ticket"
    }
    ```

    #### Error Response

    ```json
    {
        "error": "Bad request"
    }
    ```

1.  ### Delete Ticket

    `DELETE /tickets/:id`
    - Delete ticket with specified id

    #### Parameters
    - `id` - id of the ticket

    #### Example

    ```bash
    curl -X DELETE http://localhost:8080/tickets/1

    ```

    #### Success Response

    ```json
    {
        "message": "successfully deleted ticket"
    }
    ```

    #### Error Response

    ```json
    {
        "error": "Ticket not found"
    }
    ```
