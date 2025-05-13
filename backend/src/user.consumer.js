import { consumeMessages } from './lib/rabbitmq.js';

const handleUserRegistration = (message) => {
    console.log(`[User Consumer] Received user registration: ${JSON.stringify(message)}`);
    console.log(`Processing user registration for user ID: ${message.userId}`);
};

consumeMessages('userRegisteredQueue', handleUserRegistration);