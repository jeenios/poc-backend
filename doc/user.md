# User API Specification

## Register User

Enpoint : POST /api/users

Request Body :

```json
{
  "username": "alilatukau",
  "password": "rahasia",
  "name": "Ali Latukau"
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "alilatukau",
    "name": "Ali Latukau"
  }
}
```

Response Body (Error) :

```json
{
  "errors": "username already registered"
}
```

## Login User

Enpoint : POST /api/users/login

Request Body :

```json
{
  "username": "alilatukau",
  "password": "rahasia"
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "alilatukau",
    "name": "Ali Latukau",
    "token": "session_id_generated"
  }
}
```

Response Body (Error) :

```json
{
  "errors": "username and password is wrong"
}
```

## Get User

Enpoint : GET /api/users/current

Header :

- Authorization: token

Response Body (Success) :

```json
{
  "data": {
    "username": "alilatukau",
    "name": "Ali Latukau"
  }
}
```

Response Body (Error) :

```json
{
  "errors": "unauthorized"
}
```

## Update User

Enpoint : PATCH /api/users/current

Header :

- Authorization: token

Request Body :

```json
{
  "password": "rahasia",
  "name": "Ali Latukau"
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "alilatukau",
    "name": "Ali Latukau"
  }
}
```

## Logout User

Enpoint : DELETE /api/users/current

Header :

- Authorization: token

Response Body (Success) :

```json
{
  "data": true
}
```
