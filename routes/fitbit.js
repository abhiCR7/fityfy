/**
 * Created by Sunny on 10-09-2016.
 */

var express = require('express');
var router = express.Router();
var request = require('request');
var mongoose = require('mongoose');
var userModel = require('../models/user');
var config = require('../config/index');

var urlParams = process.env.NODE_ENV === 'production' ? {
    url: "https://fitifyapp.herokuapp.com",
    secret: "810e00561ed24dc6f88a2d3a92d41be0",
    client_id: "227Z8Y",
    auth_header: "MjI3WjhZOjgxMGUwMDU2MWVkMjRkYzZmODhhMmQzYTkyZDQxYmUw"
} : {
    url: "http://localhost:3000", secret: "5eb6b390612d068ed1afff58723be579", client_id: "227Z8Z",
    auth_header: "MjI3WjhaOjVlYjZiMzkwNjEyZDA2OGVkMWFmZmY1ODcyM2JlNTc5"
};

var callbackHandler = function (req, res, next) {
    var accessCode, accessToken, refreshCode, userId, token_type;
    var json = req.query;
    accessCode = json.code;
    console.log("callback query params", json);
    var authBody;
    getAuthToken(accessCode, function (error, body) {
        if(error){
            console.log("error fetching auth token", error);
        }
        authBody = JSON.parse(body);
        console.log("authBody Receieved", authBody);
        userId = authBody.user_id;
        // {"access_token":"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzUjNEUkMiLCJhdWQiOiIyMjdaOFoiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJ3aHIgd251dCB3cHJvIHdzbGUgd3dlaSB3c29jIHdzZXQgd2FjdCB3bG9jIiwiZXhwIjoxNDczNTQ3MDgzLCJpYXQiOjE0NzM1MTgyODN9.biswdD61QPSw0qaJGRIJ5tY3ywefcpSWCnvPEZC0b7E",
        //     "expires_in":28800,
        //     "refresh_token":"376b845d13ecaa46c57df4a8a3aea75d2693c31d9f726b064a0425a121ca60db",
        //     "scope":"settings nutrition sleep location weight heartrate profile social activity",
        //     "token_type":"Bearer",
        //     "user_id":"3R3DRC"}

        var user = mongoose.model('user', userModel.user);

        var userRecord = new user({
            access_token : authBody.access_token,
            refresh_token: authBody.refresh_token,
            user_id: authBody.user_id
        });
        userRecord.save(function (err) {
            if (err) {
                console.log('Couldn\'t save for user',userId,err);
            } else {
                console.log('Saved user Record for ',userId);
                res.redirect(301,
                    "https://fitifyapp.herokuapp.com/open");
            }
        });
        
    });
};

var _getAccessCode = function () {
    return accessCode;
};
var _getUserId = function () {
    return userId;
};
var _getRefreshCode = function () {
    return refreshCode;
}

var getAuthToken = function (accessCode, callback) {
    // curl -X POST -i -H 'Authorization: Basic MjI3WjhaOjVlYjZiMzkwNjEyZDA2OGVkMWFmZmY1ODcyM2JlNTc5'
    // -H 'Content-Type: application/x-www-form-urlencoded'
    // -d "clientId=227Z8Z"
    // -d "grant_type=authorization_code"
    // -d "redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Ffitbit%2Fauth_confirm"
    // -d "code=606ef0e5f26bc887e26128dccd014c7a6117fc12"
    // https://api.fitbit.com/oauth2/token asfdghjkl

    var options = {
        method: 'POST',
        url: 'https://api.fitbit.com/oauth2/token',
        headers: {
            authorization: 'Basic '+urlParams.auth_header,
            'content-type': 'application/x-www-form-urlencoded'
        },
        form: {
            clientId: urlParams.client_id,
            grant_type: 'authorization_code',
            redirect_uri: urlParams.url +'/fitbit/auth_confirm',
            code: accessCode
        }
    };

    request(options, function (error, response, body) {
        if (error) {
            callback(error);
        }

        console.log(body);
        callback(null, body);
    });


};
var initAuth = function (req, res, next) {
    var devRedirectUrl = "https://www.fitbit.com/oauth2/authorize?response_type=code&client_id="+urlParams.client_id+"&redirect_uri="+urlParams.url+"/fitbit%2Fauth_confirm&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=2592000";
    console.log("REDIRECTING ",devRedirectUrl);
    res.redirect(301, devRedirectUrl);
};

module.exports = router;

router.get('/auth_confirm', callbackHandler);
router.get('/auth_init',initAuth);