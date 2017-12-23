# Flash Me

A flash card app for Casey.

## Getting Started

These instructions will get the project up and running on your machine for development and testing purposes.

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
yarn run build -- --watch
```

This will build the server and the client, and watch your local files for changes.

In another terminal, run the following command:

```sh
yarn run start
```

This will run the server (required for the website to work) and will restart automatically when any changes are detected.

You should now be able to browse to http://localhost:3000/ and see the application running!