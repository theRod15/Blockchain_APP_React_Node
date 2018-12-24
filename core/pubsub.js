const redis = require('redis');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKHAIN: 'BLOCKCHAIN'
};

class PubSub {
    constructor({ blockchain }) {
        this.blockchain = blockchain;

        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        this.subscribeToChannels();

        this.subscriber.on('message', (channel, message) => this.handleMessage(channel, message));
    }

    handleMessage(channel, message) {
        console.log(`Message received. Channel: ${ channel }. Message: ${ message }.`)

        const parsedMessage = JSON.stringify(message);

        if (channel === CHANNELS.BLOCKHAIN) {
            this.blockchain.replaceChain(parsedMessage);
        }
    }

    subscribeToChannels() {
        Object.values(CHANNELS).forEach(channel => {
            this.subscriber.subscribe(channel)
        });
    }

    publish({ channel, message }) {
        this.publisher.publish(channel, message)
    }

    broadcast() {
        this.publish({
            channel: CHANNELS.BLOCKHAIN,
            message: JSON.stringify(this.blockchain.chain)
        })
    }
}

module.exports = PubSub;