const express = require('express');
const debug = require('debug')('server');
const morgan = require('morgan');

require('dotenv').config();

require('./src/ddbb/mongoose.config');
require('./src/auth/auth');

const SERVER = express();
const PORT = process.env.PORT || 4000;
const routes = require('./src/routes/routes');

SERVER.use(morgan('dev'));
SERVER.use(express.json());
SERVER.use(express.urlencoded({ extended: true }));

SERVER.use('/', routes);

SERVER.get('/', (req, res) => { res.send('works'); });

SERVER.listen(PORT, debug(`server is running on port ${PORT}`));
