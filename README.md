Application for authentication users written on Nest JS framework and used non-relational database MongoDB, Passport, JWT, RabbitMQ and 2f authentication by sending code via telegram. Consists of main application (this repository) and 2 other nestjs applications-microservices:
- telegram bot for receiving codes from users https://github.com/SK83377/auth_tg_bot
- application, used for sending codes to users https://github.com/SK83377/sendcodems/tree/main
.env file variables need to be filled with relevent data.


## Installation
$ npm install

## Running the app

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```