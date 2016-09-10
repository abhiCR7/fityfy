/**
 * Created by Sunny on 10-09-2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({
    user_id: {type: String, required: true},
    access_token: {type: String, required: true},
    refresh_token: {type: String, required: true}
});

module.exports = {
    user: user
};