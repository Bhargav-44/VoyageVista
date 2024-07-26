const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },

    // origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials:true
}

module.exports = corsOptions;