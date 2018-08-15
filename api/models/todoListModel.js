'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TaskSchema = new Schema({
    name: {
        type: String,
        required: 'Kindly enter the name of the task'
    },
    description: {
        type: String,
        required: 'Please enter some description'
    },
    last_updated: {
        type: Date,
        default: Date.now
    },
    status: {
        type: [{
            type: String,
            enum: ['pending', 'ongoing', 'completed']
        }],
        default: ['pending']
    },
    user_id:{
        type: String,
        required: 'This is required'
    }
});

module.exports = mongoose.model('Tasks', TaskSchema);