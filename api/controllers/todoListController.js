'use strict';


var mongoose = require('mongoose'),
    Task = mongoose.model('Tasks'),
    User = mongoose.model('User');

exports.list_all_tasks = function (req, res) {
    console.log('Getting all tasks for userId = ' + req.userId);
    Task.find({
        user_id: req.userId
    }, function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};


exports.create_a_task = function (req, res) {
    console.log('Creating a tasks for userId = ' + req.userId);
    var new_task = new Task({
        name: req.body.name,
        description: req.body.description,
        user_id: req.userId
    })
    new_task.save(function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};


exports.read_a_task = function (req, res) {
    console.log('Getting a task for userId = ' + req.userId);
    Task.findById(req.params.taskId, function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};


exports.update_a_task = function (req, res) {
    Task.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};


exports.delete_a_task = function (req, res) {


    Task.remove({
        _id: req.params.taskId
    }, function (err, task) {
        if (err)
            res.send(err);
        res.json({message: 'Task successfully deleted'});
    });
};


/* USER AUTHENTICATION */
var config = require('../../config');


exports.me = function (req, res, next) {
    User.findById(req.userId, {password: 0}, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user founded.");

        res.status(200).send(user);
    });
}

