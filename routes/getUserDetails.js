/**
 * Created by Sunny on 10-09-2016.
 */

var express = require('express');
var router = express.Router();
var request = require('request');
var mongoose = require('mongoose');
var userModel = require('../models/user');
var config = require('../config/index');

var _generateSleepProfile = function (userId) {

};

module.exports = {
  generateSleepProfile: _generateSleepProfile
}