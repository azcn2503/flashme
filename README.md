# Flash Me

[![Build Status](https://travis-ci.org/azcn2503/flashme.svg?branch=master)](https://travis-ci.org/azcn2503/flashme)
[![Known Vulnerabilities](https://snyk.io/test/github/azcn2503/flashme/badge.svg)](https://snyk.io/test/github/azcn2503/flashme)

A flash card app for Casey.

## Getting Started

These instructions will get the project up and running on your machine for development and testing purposes.

If you just want to use the app, it is available as a demo at: [https://casey-flash-card-app.herokuapp.com](https://casey-flash-card-app.herokuapp.com)

### Prerequisites

* [Node.js](https://nodejs.org/en/download/)
* [Yarn](https://yarnpkg.com/en/docs/install)

### Installing

Download this project to a folder somewhere, then open your favourite terminal and run the following commands:

```sh
yarn
```

This will install the dependencies.

```sh
yarn run build:dev
```

This will build the server and the client, and watch your local files for changes.

In another terminal, run the following command:

```sh
MONGO_URL=mongodb://username:password@some.mongo.connection yarn run start:dev
```

This will run the server (required for the website to work) and will restart automatically when any changes are detected.

You should now be able to browse to http://localhost:3000/ and see the application running!
