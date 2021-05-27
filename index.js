const express = require('express');
const debug = require('debug')('server');
const morgan = require('morgan');
const passport = require('passport');

const PORT = process.env.PORT || 4000;

require('dotenv').config();
require('./src/ddbb/mongoose.config');
require('./src/auth/auth');

const server = express();
const routes = require('./src/routes/routes');
const protectedRoutes = require('./src/routes/protected-routes');

server.use(morgan('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use('/api/', routes);
server.use('/api/user', passport.authenticate('jwt', { session: false }), protectedRoutes);

server.listen(PORT, debug(`server is running on port ${PORT}`));
