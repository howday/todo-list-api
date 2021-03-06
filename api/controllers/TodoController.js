'use strict';


const mongoose = require('mongoose'),
    Task = mongoose.model('Tasks');
const todoQueryParser = require('../helper/QueryParser')


exports.list_all_tasks = function (req, res) {
    console.log('Getting all tasks for userId = ' + req.userId);
    let pagination = todoQueryParser(req.query);
    Task.find({
        user_id: req.userId
    }, function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    }).sort(pagination['sortOrder']).limit(pagination['limit']).skip(pagination['offset']);
};


exports.create_a_task = function (req, res) {
    console.log('Creating a tasks for userId = ' + req.userId);
    let new_task = new Task({
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
    req.body.last_updated = Date.now();
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


