# Address API Specification

## Create Address

Enpoint : POST /api/contacts/:contactId/addresses

Header :

- Authorization: token

Request Body :

```json
{
  "street": "Jalan Pasawahan",
  "city": "Kuningan",
  "province": "Jawa Barat",
  "country": "Indonesia",
  "postal_code": "123123"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "street": "Jalan Pasawahan",
    "city": "Kuningan",
    "province": "Jawa Barat",
    "country": "Indonesia",
    "postal_code": "123123"
  }
}
```

Response Body (Error) :

```json
{
  "errors": "contact not found"
}
```

## Get Address

Enpoint : GET /api/contacts/:contactId/addresses/:addressId

Header :

- Authorization: token

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "street": "Jalan Pasawahan",
    "city": "Kuningan",
    "province": "Jawa Barat",
    "country": "Indonesia",
    "postal_code": "123123"
  }
}
```

Response Body (Error) :

```json
{
  "errors": "contact not found"
}
```

## Update Address

Enpoint : PUT /api/contacts/:contactId/addresses/:addressId

Header :

- Authorization: token

Request Body :

```json
{
  "street": "Jalan Pasawahan",
  "city": "Kuningan",
  "province": "Jawa Barat",
  "country": "Indonesia",
  "postal_code": "123123"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "street": "Jalan Pasawahan",
    "city": "Kuningan",
    "province": "Jawa Barat",
    "country": "Indonesia",
    "postal_code": "123123"
  }
}
```

Response Body (Error) :

```json
{
  "errors": "contact not found"
}
```

## Remove Address

Enpoint : DELETE /api/contacts/:contactId/addresses/:addressId

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

## List Address

Enpoint : GET /api/contacts/:contactId/addresses

Header :

- Authorization: token

Response Body (Success) :

```json
{
  "data": [
    {
      "id": 1,
      "street": "Jalan Pasawahan",
      "city": "Kuningan",
      "province": "Jawa Barat",
      "country": "Indonesia",
      "postal_code": "123123"
    }
  ]
}
```

Response Body (Error) :

```json
{
  "errors": "contact not found"
}
```
