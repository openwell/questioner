# Questioner
[![Build Status](https://travis-ci.org/openwell/questioner.svg?branch=develop)](https://travis-ci.org/openwell/questioner)
[![Coverage Status](https://coveralls.io/repos/github/openwell/questioner/badge.svg?branch=develop)](https://coveralls.io/github/openwell/questioner?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/a3a966589be730bc865e/maintainability)](https://codeclimate.com/github/openwell/questioner/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/a3a966589be730bc865e/test_coverage)](https://codeclimate.com/github/openwell/questioner/test_coverage)
# Crowd-source questions for a meetup.

Questioner helps the meetup organizer prioritize
questions to be answered.

## Getting Started

Clone the Repo.
-------------
Run `npm install` to install all necessary packages.

### Prerequisites

The following tools will be needed to run this application successfully:

Node v8.11.3 or above
---
Npm v5.6 or above
---

### ENDPOINTS

- POST `/api/v1/meetups` Create an meetup record.
- GET `/api/v1/meetups` Fetch all meetup records.
- GET `/api/v1/meetups/1/:meetup-id` Fetch a specific meetup record.
- GET `/api/v1/meetups/upcoming/` Fetch all upcoming meetup records.
- POST `/api/v1/questions` Create a question for a specific meetup.
- GET `/api/v1/questions` Fetch all questions.
- PATCH `/api/v1/questions/:question-id/upvote` Upvote (increase votes by 1) a specific question.
- PATCH `/api/v1/questions/:question-id/downvote` Downvote (decrease votes by 1) a specific question.
- POST `/api/v1/meetups/:meetup-id/rsvps` Respond to meetup RSVP.
- POST `/api/v1/auth/signup` Create a user account.
- POST `/api/v1/auth/login` Login a user
- POST `/api/v1/auth/admin` Login as an admin
- POST `/api/v1/comments/` Comment on a question.
- GET `/api/v1/comments/:question-Id/` Comment on a question.
- DELETE `/api/v1/meetups/:meetup-id` Delete a meetup.


### Installing

## On your Local Machine
- Pull the [develop](https://github.com/openwell/Questioner) branch off this repository
- Install postgreSql 11 on your local machine or registered on any online platform
- create a .env file
- create a database and input the connection string into the .env file
- create a secret key, admin details and input in .env file
- template can be found in .env-sample file
- Run `npm install` to install all dependencies
- Run `npm database` to create the database tables and create an admin
- An admin token is generated if successfully and will be displayed in the terminal
- Run `npm start` to start the app
- App runs on port 3000
- Access endpoints on `localhost:3000`


## Running the tests

Run `npm test` in the terminal for the cloned folder.

### Break down into end to end tests

- It tests the API end-point.
- It tests the REST API functionality

### Deployment on Heroku Server
`https://questioner1.herokuapp.com/api/v1`


## Built With

* [Node.js](http://www.nodejs.org/) - Runtime-Environment

## Authors

* **Ojo Timileyin**

## Acknowledgments
* [Web Developerment Youtuber](htttps://youtube.com)
* [StackOver-Flow](https://stackoverflow.org)
* The Andela Organisation
* [Udemy.com](https://udemy.com)
* Andela 21 Colleagues
