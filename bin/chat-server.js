const express = require('express');
const parser = require('body-parser');
const redisLib = require('redis');
const RedisNotifier = require('redis-notifier');
const idLib = require('shortid');

const appEnv = process.env.NODE_ENV;
const config = require('../config')[appEnv];

const expiryTime = config.expiryTime;
const appPort = config.chatPort;
const redisPort = config.redisPort;
const dbIndex = appEnv === 'production' ? 0 : 1;

const redisClient = redisLib.createClient(redisPort, { db: dbIndex });
redisClient.flushdb();

const redisListener = new RedisNotifier(redisLib, {
    redis: {
        db: dbIndex,
    },
    expired: true,
    evicted: false
});

redisListener.on('message', (pattern, eventChannel, key) => {
    const channelKey = key + '-channel';

    redisClient.get(channelKey, (err, channelSet) => {
        redisClient.srem(channelSet, key);
        redisClient.del(channelKey);
    });
});

const app = express();

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

app.get('/', (req, res) => {
    res.json({
        routes: [
            '/auth: [POST]',
            '/messages: [GET, POST]',
        ],
    });
});

app.get('/messages/:channel', (req, res) => {
    const channel = req.params.channel;

    redisClient.smembers('tag:' + channel, (err, ids) => {
        if (ids.length === 0) {
            res.status(200).json([]);

            return;
        }

        let messages = [];
        let idIndex = 0;

        ids.forEach((id) => {
            redisClient.get(id, (err, message) => {
                messages[messages.length] = message;

                if (++idIndex === ids.length) {
                    res.status(200).json(messages);
                }
            });
        });
    });
});

app.post('/messages/:channel', (req, res) => {
    const channel = req.params.channel;
    const channelTag = 'tag:' + channel;

    const message = req.body.message;

    const id = idLib.generate() + (new Date()).getTime();

    redisClient.set(id, message);
    redisClient.expire(id, expiryTime);

    redisClient.sadd(channelTag, id);
    redisClient.set(id + '-channel', channelTag);

    res.status(201).send();
});

app.listen(appPort);

module.exports = app;
