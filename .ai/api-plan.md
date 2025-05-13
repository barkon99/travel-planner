# REST API Plan for VibeTravels

## 1. Resources

| Resource | Database Table | Description |
|----------|---------------|-------------|
| Users | users | Managed by Supabase Auth, represents application users |
| TravelPlans | travel_plans | Travel itineraries created by users |
| Locations | locations | Points of interest within day plans (attractions, restaurants, activities) |
| EstimatedCosts | estimated_costs | Cost breakdown for each day of a travel plan |
| HistoricalFacts | historical_facts | Interesting historical information about destinations |
| AIResponses | ai_responses | Stored responses from AI model for travel plans |
| EventLogs | event_logs | System logs for user actions |

## 2. Endpoints

### Authentication

#### Register User
- **Method**: POST
- **Path**: `/auth/register`
- **Description**: Register a new user (Handled by Supabase Auth)
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "id": "uuid",
    "email": "string",
    "created_at": "timestamp"
  }
  ```
- **Success Codes**: 201 Created
- **Error Codes**: 400 Bad Request, 409 Conflict (Email already exists)

#### Login
- **Method**: POST
- **Path**: `/auth/login`
- **Description**: Authenticate a user (Handled by Supabase Auth)
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "string",
    "refresh_token": "string",
    "user": {
      "id": "uuid",
      "email": "string"
    }
  }
  ```
- **Success Codes**: 200 OK
- **Error Codes**: 400 Bad Request, 401 Unauthorized

### Travel Plans

#### Create Travel Plan
- **Method**: POST
- **Path**: `/travel-plans`
- **Description**: Create a new travel plan and initiate AI generation
- **Request Body**:
  ```json
  {
    "destination": "string",
    "duration_days": "integer",
    "travel_type": "budget|medium|luxury",
    "preferences": ["string", "string"],
    "places_to_visit": ["string", "string"]
  }
  ```
- **Response**:
  ```json
  {
    "id": "uuid",
    "user_id": "uuid",
    "destination": "string",
    "duration_days": "integer",
    "travel_type": "string",
    "preferences": ["string"],
    "places_to_visit": ["string"],
    "created_at": "timestamp",
    "updated_at": "timestamp",
    "generation_status": "pending|completed|failed"
  }
  ```
- **Success Codes**: 201 Created
- **Error Codes**: 400 Bad Request, 401 Unauthorized

#### List Travel Plans
- **Method**: GET
- **Path**: `/travel-plans`
- **Description**: Get all travel plans for the authenticated user
- **Query Parameters**:
  - `page`: integer (default: 1)
  - `limit`: integer (default: 10)
  - `sort_by`: string (default: "created_at")
  - `sort_order`: string (default: "desc")
- **Response**:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "destination": "string",
        "duration_days": "integer",
        "travel_type": "string",
        "created_at": "timestamp",
        "updated_at": "timestamp"
      }
    ],
    "pagination": {
      "total": "integer",
      "page": "integer",
      "limit": "integer",
      "pages": "integer"
    }
  }
  ```
- **Success Codes**: 200 OK
- **Error Codes**: 401 Unauthorized

#### Get Travel Plan
- **Method**: GET
- **Path**: `/travel-plans/{id}`
- **Description**: Get details of a specific travel plan with all related data
- **Response**:
  ```json
  {
    "id": "uuid",
    "user_id": "uuid",
    "destination": "string",
    "duration_days": "integer",
    "travel_type": "string",
    "preferences": ["string"],
    "places_to_visit": ["string"],
    "created_at": "timestamp",
    "updated_at": "timestamp",
    "day_plans": [
      {
        "id": "uuid",
        "day_number": "integer",
        "summary": "string",
        "locations": [
          {
            "id": "uuid",
            "name": "string",
            "description": "string",
            "type": "attraction|restaurant|activity",
            "latitude": "number",
            "longitude": "number",
            "cost": "number",
            "time_needed": "integer"
          }
        ],
        "estimated_costs": {
          "accommodation": "number",
          "transport": "number",
          "food": "number",
          "attractions": "number"
        }
      }
    ],
    "historical_facts": [
      {
        "id": "uuid",
        "place": "string",
        "description": "string"
      }
    ],
    "user_notes": [
      {
        "id": "uuid",
        "notes_text": "string",
        "created_at": "timestamp"
      }
    ],
    "total_estimated_cost": "number"
  }
  ```
- **Success Codes**: 200 OK
- **Error Codes**: 401 Unauthorized, 403 Forbidden, 404 Not Found

#### Delete Travel Plan
- **Method**: DELETE
- **Path**: `/travel-plans/{id}`
- **Description**: Delete a specific travel plan and all related data
- **Response**: No content
- **Success Codes**: 204 No Content
- **Error Codes**: 401 Unauthorized, 403 Forbidden, 404 Not Found

#### Generate Travel Plan
- **Method**: POST
- **Path**: `/travel-plans/generate`
- **Description**: Generate a complete travel plan immediately without queueing
- **Request Body**:
  ```json
  {
    "destination": "string",
    "duration_days": "integer",
    "travel_type": "budget|medium|luxury",
    "preferences": ["string", "string"],
    "places_to_visit": ["string", "string"]
  }
  ```
- **Response**: The complete travel plan with all details
  ```json
  {
    "id": "uuid",
    "user_id": "uuid",
    "destination": "string",
    "duration_days": "integer",
    "travel_type": "string",
    "preferences": ["string"],
    "places_to_visit": ["string"],
    "created_at": "timestamp",
    "updated_at": "timestamp",
    "generation_status": "completed",
    "day_plans": [
      {
        "id": "uuid",
        "day_number": "integer",
        "summary": "string",
        "locations": [...],
        "estimated_costs": {...}
      }
    ],
    "historical_facts": [...],
    "user_notes": [],
    "total_estimated_cost": "number"
  }
  ```
- **Success Codes**: 200 OK
- **Error Codes**: 400 Bad Request, 401 Unauthorized

### Plan Modification

#### Request Plan Modification
- **Method**: POST
- **Path**: `/travel-plans/{id}/modify`
- **Description**: Request AI to modify an existing travel plan based on user feedback
- **Request Body**:
  ```json
  {
    "modification_request": "string"
  }
  ```
- **Response**:
  ```json
  {
    "status": "pending|completed|failed",
    "message": "string"
  }
  ```
- **Success Codes**: 202 Accepted
- **Error Codes**: 400 Bad Request, 401 Unauthorized, 404 Not Found

### Historical Facts

#### Get Historical Facts
- **Method**: GET
- **Path**: `/travel-plans/{id}/historical-facts`
- **Description**: Get all historical facts for a travel plan
- **Response**:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "place": "string",
        "description": "string",
        "created_at": "timestamp"
      }
    ]
  }
  ```
- **Success Codes**: 200 OK
- **Error Codes**: 401 Unauthorized, 403 Forbidden, 404 Not Found

### Cost Estimation

#### Get Total Cost Estimation
- **Method**: GET
- **Path**: `/travel-plans/{id}/total-cost`
- **Description**: Get aggregated cost estimation for the entire travel plan
- **Response**:
  ```json
  {
    "total": "number",
    "breakdown": {
      "accommodation": "number",
      "transport": "number",
      "food": "number",
      "attractions": "number"
    },
    "daily": [
      {
        "day_number": "integer",
        "total": "number",
        "accommodation": "number",
        "transport": "number",
        "food": "number",
        "attractions": "number"
      }
    ]
  }
  ```
- **Success Codes**: 200 OK
- **Error Codes**: 401 Unauthorized, 403 Forbidden, 404 Not Found

## 3. Authentication and Authorization

The VibeTravels application uses Supabase Auth for authentication and authorization:

1. **Authentication Mechanism**:
   - JWT (JSON Web Tokens) based authentication
   - Tokens are issued upon successful login and included in the Authorization header for API requests
   - The format for the header is: `Authorization: Bearer {token}`

2. **Authorization**:
   - Row Level Security (RLS) policies in Supabase ensure users can only access their own data
   - API endpoints validate the user's identity and permissions before processing requests
   - All authenticated endpoints require a valid JWT token

3. **Roles and Permissions**:
   - **Anonymous**: Can only access public routes (register, login, password reset)
   - **Authenticated User**: Can create, view, modify, and delete their own travel plans and associated data

4. **Token Management**:
   - Access tokens expire after 1 hour
   - Refresh tokens are provided for obtaining new access tokens without re-authentication
   - Tokens can be revoked on logout or password change

## 4. Validation and Business Logic

### Validation Rules

#### Travel Plans
- Destination must not be empty
- Duration must be between 1 and 30 days
- Travel type must be one of: 'budget', 'medium', 'luxury'
- Preferences array must have at least 1 and at most 10 items

#### User Notes
- Notes text must not exceed 500 characters

#### Historical Facts
- Description must not exceed 1000 characters

#### Locations
- Type must be one of: 'attraction', 'restaurant', 'activity'
- Cost must be a positive number or zero
- Time needed must be a positive integer or null

### Business Logic Implementation

1. **Travel Plan Generation**:
   - When a travel plan is requested, the system directly generates the complete plan using AI
   - Generation includes creating day plans, locations, estimated costs, and historical facts
   - The complete plan is returned immediately in the response
   - No queuing or status checking is needed

2. **Plan Modification**:
   - When a modification is requested, the system preserves the original plan while generating a new version
   - If the modification fails, the original plan remains intact
   - Once successful, the modified plan replaces the original

3. **Cost Calculation**:
   - Daily costs are calculated from the costs of individual locations plus estimated accommodation, transport, and food
   - Total trip cost is calculated by aggregating all daily costs
   - Costs are adjusted based on the travel type (budget, medium, luxury)

4. **Access Control**:
   - Users can only access, modify, and delete their own travel plans
   - API endpoints enforce these access controls by validating user ownership

5. **Event Logging**:
   - Key user actions (registration, login, profile updates, plan creation, plan edits) are logged
   - Logs help with debugging and usage analytics

6. **Rate Limiting**:
   - AI generation endpoints are rate-limited to prevent abuse
   - Users are limited to a reasonable number of plan generations per day

7. **Error Handling**:
   - API returns appropriate HTTP status codes and error messages
   - Errors are logged for debugging purposes
   - User-friendly error messages are provided in responses 