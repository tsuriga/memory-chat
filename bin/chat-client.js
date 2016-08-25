const readline = require('readline');
const request = require('request');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let port = 0;
let channel = '';
let url = '';

function askForServerPort() {
    rl.question('Chat server port: ', (serverPort) => {
        port = serverPort;

        printWelcomeMessage();
        askForChannel();
    });
}

function printWelcomeMessage() {
    console.log("Commands:\n");
    console.log("  .say MESSAGE  - Send message to channel");
    console.log("  .listen       - Get channel messages");
    console.log("  .exit         - Exit a channel");
    console.log("  .quit         - Quit chat client");
}

function askForChannel() {
    console.log();

    rl.question('Join a channel > ', (newChannel) => {
        if (newChannel === '.quit') {
            rl.close();
            process.exit(0);
        }

        channel = newChannel;
        url = 'http://127.0.0.1:' + port + '/messages/' + channel;

        askForMessage();
    });
}

function askForMessage() {
    rl.question('#' + channel + ' > ', (message) => {
        if (message === '.exit') {
            askForChannel();

        } else if (message === '.quit') {
            rl.close();
            process.exit(0);

        } else if (message === '.listen') {
            request.get({ uri: url, json: true },
                (err, res, body) => {
                    if (body.length === 0) {
                        console.log('No messages');
                    } else {
                        console.log('----------------');

                        body.forEach((message) => {
                            console.log(message);
                            console.log('----------------');
                        });
                    }

                    askForMessage();
                }
            );
        } else if (message.substr(0, 5) === '.say ') {
            request.post({ uri: url, json: { message: message.substr(5) } },
                (err, res, body) => {
                    if (res.statusCode === 201) {
                        console.log('Message sent');
                    } else {
                        console.log('Message could not be sent');
                    }

                    askForMessage();
            });
        } else {
            askForMessage();
        }
    });
}

askForServerPort();
