'use strict';

var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the user'
  },
  email: {
    type: String,
    required: 'Kindly enter the email of the user'
  },
  password: {
    type: String,
    required: 'indly enter the password of the user'
  }
});


module.exports = mongoose.model('User',UserSchema);