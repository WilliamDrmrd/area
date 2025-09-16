<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">
    <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
    <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
    <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
    <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
    <a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
    <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
    <a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
    <a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
    <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
    <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>

## Description

##### This project is built using the [Nest](https://github.com/nestjs/nest) framework.

## Installation

```bash
$ yarn install
```

```bash
# for development only
$ sudo npm i -g @nestjs/cli
```

## Running the app without docker

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# test coverage
$ yarn run test:cov
```

## Compdoc documentation

`docker compose up server-documentation`
Then clic on the generated link.

## [API routes documentation](./docs/api-routes.md)

## How to create a new module

```bash
# creates the folder and the module file (autoimport in the app module)
nest g module <name>

# creates the service for that module and the spec file (tests)
nest g service <name>

# creates the controller that will handle the request for this module
nest g controller <name> --no-spec
```

You can create other providers in the module by doing :

```bash
# add --flat if you dont want a folder inside your module
nest g pr <module-name>/<provider-name>
```

## [Create new service for the application](./docs/create-new-service.md)

## Add / change a table in the database

#### 1. change the scheme in `src/prisma/scheme.prisma`

Change or add a model in the database.
Refer to the [Prisma documentation](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/using-prisma-migrate-typescript-postgresql) to do so.

#### 2. Start the database

Start the database docker with `docker compose up db -d`.

#### 3. Run the Prisma migration command in the api folder:

`yarn prisma migrate dev`

#### Troubleshooting

You may need to delete the whole database when changing the scheme.
`docker rm <db-name> && yes | docker volume prune`

If you added new relation, don't forget to run the `yarn prisma format` command.
This command will add the missing relationship in the scheme.

Refer to the [Prisma troubleshooting documentation](https://www.prisma.io/docs/guides/migrate/production-troubleshooting).

## License

Nest is [MIT licensed](LICENSE).
