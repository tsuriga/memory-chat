const production = {
    // Message expiration time
    expiryTime: 30,

    // Chat server port
    chatPort: 3000,

    // Redis server port
    redisPort: 6379
};

const testing = {
    expiryTime: 1,
    chatPort: production.chatPort,
    redisPort: production.redisPort
}

module.exports = {
    production: production,
    testing: testing
}
