# devTinder APIs

## Auth Routes
- POST /signup
- POST /login
- POST /logout

## Profile Routes
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## Connectio Request Route
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## User Routes
- GET /user/connections
- GET /user/requests
- GET /user/feed

status: ignored, interested, accepted, rejected