const mqtt = require('mqtt');
const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config();

const protocol = 'mqtts';
const host = process.env.HOST;
const port = process.env.PORT;
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `${protocol}://${host}:${port}`;

const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: process.env.UNAME,
    password: process.env.PASS,
    recconectPeriod: 1000,
    rejectUnauthorized: false,
});

console.log('Starting new connection...');

client.on('connect', () => {
    console.log('Client connected!');
    let topic = `device/${process.env.CEREAL}/report`;
    client.subscribe(topic, () => {
        console.log(`Subscribed to topic: ${topic}`);
    });
});

client.on('message', (topic, message) => {
    console.log(`Received message from topic: ${topic}`);
    fs.writeFile('status.json', message.toString(), (err) => {
        if (err) {
            console.log(err);
        }
    });
    client.end(true);
});
