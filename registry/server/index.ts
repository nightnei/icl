import path from 'path';

process.env.NODE_CONFIG_DIR = path.resolve(__dirname, '../config');
// require('newrelic'); //Should be lower then NODE_CONFIG_DIR env var definition

import app from './app';
import runServer from './server';

const server = runServer(app);

module.exports = server;
