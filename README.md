# Authenticated short-memory chat

A demonstration what time as a security factor could mean in an application.

This is a sample chat app that uses tagging to sort messages into channels.
Messages will only live for a short period of time.

TODO:
Queries will be limited to once per two times a message's lifetime to make sure
that the receiver will have to know when the message is published. Pushing
messages will require clients to authenticate using JSON Web Tokens.

Includes tests for the server.

## Demonstrated features

- Basic NodeJS REST API building blocks
- Redis key expiration
- Redis sets for tagging purposes
- Redis keyspace events
- JWT (JSON Web Tokens) (TODO)
- Testing an API with Mocha and Chai

## Usage

1. Run Redis server with ```--notify-keyspace-events Ex```, e.g.
```sh
redis-server --notify-keyspace-events Ex
```

2. Install dependencies

```sh
npm install
```

3. Configure app in _/config.js_

4. Run server

```sh
npm start
```

5. Run client
```sh
node bin/chat-client.js
```

## Run tests

```sh
npm test
```

## Developed on

- NodeJS 6.2.0
- Redis 3.2.0
