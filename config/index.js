/**
 * Created by hari on 10/09/16.
 */
var _ = require('lodash');
var config = _.extend({
    google: {
        auth: {
            CLIENT_ID: '1045418306989-351bu0i4t6l4a56hbbo9kq5ohp9npr0g.apps.googleusercontent.com',
            CLIENT_SECRET: 'Oz-Fd6lNKdo_7Ap8nBstpBhB'
        }
    }
}, require('./' + process.env.NODE_ENV + '.js'));
config.db = process.env.MONGODB_URI || config.db;
module.exports = config;