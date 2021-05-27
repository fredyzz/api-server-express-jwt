const express = require('express');
const debug = require('debug')('app');
const morgan = require('morgan');

require('dotenv').config();

const SERVER = express();
const PORT = process.env.PORT || 4000;

SERVER.use(morgan('dev'));

SERVER.use(express.json());
SERVER.use(express.urlencoded({ extended: true }));

SERVER.get('/', (req, res) => { res.send('works'); });

SERVER.listen(PORT, debug(`server is running on port ${PORT}`));
