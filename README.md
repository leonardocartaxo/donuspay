# Description
A pay app prototype for this  <a href="https://github.com/ztech-company/donus-code-challenge/blob/master/backend.md" target="blank">challenge</a>

## Features
- NodeJs backend written in Typescript
- Using architecture of <a href="http://nodejs.com" target="blank">Nestjs</a> 
- Swagger documentation
- MongoDB
- Integration tests
- End to end tests
- Docker componentization

### Run using Docker
```bash
$ docker-compose up --build
``` 

### Run locally using Npm
```bash
$ npm install 
$ npm start
```

### Run tests using Npm
```bash
$ npm install
$ npm test
``` 
make sure you have a mongodb running on localhost:27017

### Run end to end tests using Npm
```bash
$ npm install
$ npm run test:e2e
``` 

### Usage
After running the app you can access the documentation at: http://localhost:3000/api
