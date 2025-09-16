# <ins>api routes documentation</ins>

## <b>routes list :</b>

### <ins>routes</ins>

- POST /auth/login
- POST /auth/register
- GET /automations
- GET /automations/subscribed
- GET /automations/:id/unsubscribe
- POST /automations/create
- POST /automations/:id/subscribe
- DELETE /automations/:id
- GET /services
- GET /services/:id/actions
- GET /services/:id/reactions
- GET /services/:id/automations
- POST /services/<service_name>/auth
- GET /services/<service_name>/authData
- GET /services/<service_name>/isConnected
- GET /users/me

### <ins>Auth:</ins>

#### POST `/auth/login`

Description: Login to an existing account.

Request body :

```json
{
  "email": "string",
  "password": "string"
}
```

Valid credentials :

```json
{
  "access_token": "string"
}
```

Invalid credentials :

```json
{
  "message": "Email or password incorrect",
  "error": "Forbidden",
  "statusCode": 403
}
```

Empty crendentials :

```json
{
    "message":
    "email should not be empty",
    "email must be an email",
    "password should not be empty",
    "password is not strong enough"
    ,
  "error": "Bad Request",
  "statusCode": 400
}
```

#### POST `/auth/register`

Description: Register a new account.

Request body:

```json
{
  "email": "string",
  "password": "string",
  "username": "string",
  "firstname": "string",
  "lastname": "string"
}
```

Valid :

```json
{
  "access_token": "string"
}
```

Already created :

```json
{
  "message": "Email already exists",
  "error": "Forbidden",
  "statusCode": 403
}
```

Empty :

```json
{
  "message": [
    "username should not be empty",
    "username must be a string",
    "firstname should not be empty",
    "firstname must be a string",
    "lastname should not be empty",
    "lastname must be a string",
    "email should not be empty",
    "email must be an email",
    "password should not be empty",
    "password is not strong enough"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

### Automation:

#### GET `/automations`

Description: Retrieve a list of automations.

Valid Request :

```json
[
  {
    "id": "number",
    "createdAt": "string",
    "updatedAt": "string",
    "name": "string",
    "description": "string",
    "actionId": "number",
    "reactionId": "number",
    "creatorID": "number",
    "action": {
      "id": "number",
      "name": "string",
      "description": "string"
    },
    "reaction": {
      "id": "number",
      "name": "string",
      "description": "string"
    },
    "creator": {
      "id": "number",
      "username": "string"
    },
    "services": [
      {
        "id": "number",
        "name": "string"
      },
      {
        "id": "number",
        "name": "string"
      }
    ]
  }
]
```

Valid Request but Empty List:

```json
[]
```

#### GET `/automations/subscribed`

Description: Get all subscribed automations

Valid Request:

```json
{
    "automations": [...]
}
```

#### GET `/automations/:id/unsubscribe`

Description: Unsubscribe from an existing automation.

Request Parameters:

`id: Int`: The ID of the automation to unsubscribe from.

Valid Request:

```json
{
  "message": "You have unsubscribed from automation <automation name>"
}
```

Invalid Request:

```json
{
  "message": "you are not subscribed to this automation",
  "error": "Bad Request",
  "statusCode": 404
}
```

#### POST `/automations/create`

Description: Create a new automation.

Request Body:

```json
{
  "name": "string",
  "description": "string",

  "actionId": "number",
  "reactionId": "number"
}
```

Valid Request:

```json
{
  "message": "You have created a new automation <automation name>",
  "status": 200
}
```

Invalid Request:

```json
{
  "message": "reaction 42 not found",
  "error": "Not Found",
  "statusCode": 404
}
```

Empty Request:

```json
{
  "message": [
    "name must be a string",
    "name must be longer than or equal to 3 characters",
    "description must be a string",
    "description must be longer than or equal to 0 characters",
    "service_A_Id must be an integer number",
    "actionId must be an integer number",
    "service_R_Id must be an integer number",
    "reactionId must be an integer number"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

#### POST `/automations/:id/subscribe`

Description: Subscribe to an existing automation.

Request Parameters:

`id: Int`: The ID of the automation to subscribe to.

Request Body:

```json
{
  "actionId": "number",
  "actionAdditionalFields?": {
    "key": "string"
  },

  "reactionId": "number",
  "reactionAdditionalFields?": {
    "key": "string"
  }
}
```

Valid Request:

```json
{
  "message": "You have subscribed to automation <automation name>"
}
```

Invalid Request: Missing fields

```json
{
  "actionError": [],
  "reactionError": [
    "Fill email field with the email adress you want to send to",
    "Fill lastname field with your last name",
    "Fill firstname field with your first name"
  ]
}
```

#### DELETE `/automations/:id`

Description: Delete an automations and its corresponding histories

Successful delete :

```json
{
  "automation": {
    "id": "number",
    "createdAt": "Date | string",
    "updatedAt": "Date | string",
    "name": "string",
    "description": "string",
    "actionId": "number",
    "reactionId": "number",
    "creatorID": "number"
  },
  "message": "number"
}
```

Deletion failed :

```json
{
  "message": "This automation doesn't exist",
  "error": "Not Found",
  "statusCode": 404
}
```

### Services:

#### GET `/services`

Description: Retrieve a list of services.

Valid Request:

```json
[
  {
    "id": "number",
    "createdAt": "string",
    "name": "string",
    "description": "string",
    "actions": [
      {
        "id": "number",
        "name": "string",
        "description": "string"
      }
    ],
    "reactions": [
      {
        "id": "number",
        "name": "string",
        "description": "string"
      }
    ]
  }
]
```

#### GET `/services/:id/actions`

Description: Retrieve a list of actions for a given service.

Request Parameters:

`id: Int`: The ID of the service to retrieve actions for.

Valid Request:

```json
[
  {
    "id": "number",
    "name": "string",
    "description": "string"
  },
  {
    "id": "number",
    "name": "string",
    "description": "string"
  },
  {
    "id": "number",
    "name": "string",
    "description": "string"
  }
]
```

Valid Request but Empty List:

```json
[]
```

Invalid Request:

```json
{
  "message": "service <service_id> not found",
  "error": "Not Found",
  "statusCode": 404
}
```

#### GET `/services/:id/reactions`

Description: Retrieve a list of reactions for a given service.

Request Parameters:

`id: Int`: The ID of the service to retrieve reactions for.

Valid Request:

```json
[
  {
    "id": "number",
    "name": "srting",
    "description": "string"
  }
]
```

Valid Request but Empty List:

```json
[]
```

Invalid Request:

```json
{
  "message": "service <service_id> not found",
  "error": "Not Found",
  "statusCode": 404
}
```

#### GET `/services/:id/automations`

Description: Retrieve a list of automations for a given service.

Request Parameters:

`id: Int`: The ID of the service to retrieve automations for.

Valid Request but Empty List:

```json
[]
```

Invalid Request:

```json
{
  "message": "service <service_id> not found",
  "error": "Not Found",
  "statusCode": 404
}
```

#### POST `/services/<service_name>/auth`

Description: This is a OAuth ONLY route. Authenticate a user with a given service.

Request Parameters:

`service_name: String`: The name of the service to authenticate with.

Valid Request:

```json

```

Invalid Request:

```json
{
    "message": "Cannot GET /services/<service_name>/auth",
    "error": "Not Found",
    "statusCode": 404
}
```

#### GET `/services/<service_name>/authData`

Description: This is a OAuth ONLY route. Retrieve the auth data for a given service.

Request Parameters:

`service_name: String`: The name of the service to retrieve auth data for.

Valid Request:

```json
{
  "link": "string",
  "clientId": "string",
  "scope": "string",
  "state": "string"
}
```

Invalid Request:

```json
{
    "message": "Cannot GET /services/<service_name>/authData",
    "error": "Not Found",
    "statusCode": 404
}
```

#### GET `/services/<service_name>/isConnected`

Description: This is a OAuth ONLY route. Check if a user is connected to a given service.

Request Parameters:

`service_name: String`: The name of the service to check connection for.

Valid Request:

```json
{
  "isConnected": "boolean"
}
```

Invalid Request:

```json
{
    "message": "Cannot GET /services/<service_name>/isConnected",
    "error": "Not Found",
    "statusCode": 404
}
```

#### GET `/users/me`

Description: Retrieve the current user.

Valid Request:

```json
{
  "id": "number",
  "createdAt": "string",
  "updatedAt": "string",
  "username": "string",
  "email": "string",
  "firstname": "string",
  "lastname": "string",
  "uuid": "string",
  "isActivated": "boolean",
  "isOauth": "boolean",
  "token": "string"
}
```

Invalid Request:

```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```
