'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {
        type: String,
        required: 'Kindly enter the name of the user'
    },
    email: {
        type: String,
        unique: true,
        required: 'Kindly enter the email of the user'
    },
    password: {
        type: String,
        required: 'Kindly enter the password of the user'
    },
    status: {
        type: [{
            type: String,
            enum: ['active','pending']
        }],
        default: ['pending']
    }
});


module.exports = mongoose.model('User', UserSchema);