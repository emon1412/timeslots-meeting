Prerequisites:
- nodejs
- yarn


`yarn start` to start the server

`yarn test:unit` to run unit tests

`yarn clear-db` to clear the database


How-to:
1. Create user1 via `POST /users`

```
{
  "firstName": "Leslie",
  "lastName": "Knope",
  "timezone": "CT"
}
```
2. Create user2
```
{
  "firstName": "Ann",
  "lastName": "Perkins",
  "timezone": "CT"
}
```

3. Create timeslot for user1 via `POST /timeslots`. A 404 will be thrown if you try to create a timeslot for a user that doesn't exist.

Retrieve all timeslots for a user via `GET /timeslots/:userId`
```
{
    "start": "2021-09-01T00:00:00.000Z",
    "end": "2021-09-01T12:00:00.000Z",
    "userId": user1.id
}
```

4. Create meeting within user1's available timeslots for user2 via `POST /meetings`. A 422 will be thrown if the attendee has no matched timeslots.

```
{
  "start": "2020-09-01T11:30:00.000Z",
  "end": "2020-09-01T12:00:00.000Z",
  "ownerId": user2.id
  "attendeeId": user1.id
}
```

Note: Users can be updated via `PUT /users/:id`