/**
 * Created by hari on 10/09/16.
 */
var _ = require('lodash');
var config = _.extend({}, require('./' + process.env.NODE_ENV + '.js'));
config.db = process.env.MONGODB_URI || config.db;
module.exports = config;