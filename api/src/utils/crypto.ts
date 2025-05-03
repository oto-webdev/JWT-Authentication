import crypto from 'crypto';

const jwtSecret = crypto.randomBytes(64).toString('base64');

console.log('Generated JWT Secret:', jwtSecret);
