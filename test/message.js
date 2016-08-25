const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../bin/chat-server.js');
const should = chai.should();

chai.use(chaiHttp);

describe('GET /messages/:channel', () => {
    it('should get no messages for an empty channel', (done) => {
        chai.request(server)
            .get('/messages/test')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);

                done();
            });
    });
});

describe('POST/GET /messages/:channel', () => {
    it('should post a message to a channel', (done) => {
        const message = {
            message: 'mocha test'
        }

        chai.request(server)
            .post('/messages/test')
            .send(message)
            .end((err, res) => {
                res.should.have.status(201);

                done();
            });
    });

    it('should get recently created message from channel', (done) => {
        chai.request(server)
            .get('/messages/test')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                res.body[0].should.be.eql('mocha test');

                done();
            });
    });

    it('should not get expired message from channel', function (done) {
        setTimeout(() => {
            chai.request(server)
                .get('/messages/test')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);

                    done();
                });
        }, 1500);
    });
});
