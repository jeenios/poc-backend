# Contact API Specification

## Create Contact

Enpoint : POST /api/contacts

Header :

- Authorization: token

Request Body :

```json
{
  "first_name": "Ali",
  "last_name": "Latukau",
  "email": "alilatukau@example.com",
  "phone": "081234567890"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "first_name": "Ali",
    "last_name": "Latukau",
    "email": "alilatukau@example.com",
    "phone": "081234567890"
  }
}
```

Response Body (Error) :

```json
{
  "errors": "email already registered"
}
```

## Get Contact

Enpoint : GET /api/contacts/:contactId

Header :

- Authorization: token

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "first_name": "Ali",
    "last_name": "Latukau",
    "email": "alilatukau@example.com",
    "phone": "081234567890"
  }
}
```

Response Body (Error) :

```json
{
  "errors": "user not found"
}
```

## Update Contact

Enpoint : PUT /api/contacts/:contactId

Header :

- Authorization: token

Request Body :

```json
{
  "first_name": "Ali",
  "last_name": "Latukau",
  "email": "alilatukau@example.com",
  "phone": "081234567890"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "first_name": "Ali",
    "last_name": "Latukau",
    "email": "alilatukau@example.com",
    "phone": "081234567890"
  }
}
```

Response Body (Error) :

```json
{
  "errors": "email already registered"
}
```

## Remove Contact

Enpoint : DELETE /api/contacts/:contactId

Header :

- Authorization: token

Response Body (Success) :

```json
{
  "data": true
}
```

Response Body (Error) :

```json
{
  "errors": "contact not found"
}
```

## Search Contact

Enpoint : POST /api/contacts

Header :

- Authorization: token

Query Params :

- name: string, contact first name or last name (optional)
- email: string, contact email (optional)
- phone: string, contact phone (optional)
- page : number, default 1
- size : number, default 10

Response Body (Success) :

```json
{
  "data": [
    {
      "id": 1,
      "first_name": "Ali",
      "last_name": "Latukau",
      "email": "alilatukau@example.com",
      "phone": "081234567890"
    },
    {
      "id": 2,
      "first_name": "Kalsum",
      "last_name": "Latukau",
      "email": "kalsumlatukau@example.com",
      "phone": "081234567891"
    }
  ],
  "pagging": {
    "current_page": 1,
    "total_page": 10,
    "size": 10
  }
}
```

Response Body (Error) :

```json
{
  "errors": "contact not found"
}
```
