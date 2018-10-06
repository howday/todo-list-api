'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var ResetCodeSchema = new Schema({

    email: {
        type: String,
    },
    reset_code:{
        type: String
    },
    generated_date:{
        type: Date,
        default: Date.now
    },
    status:{
        type: String,
        default:'ACTIVE'
    }
});

module.exports = mongoose.model('ResetCode', ResetCodeSchema);