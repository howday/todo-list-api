'use strict';

const morgan = require('morgan');
const os = require('os');
const fs = require('fs');
const logDir = 'logs';

morgan.token('conversation-id', function getConversationId(req) {
    return req.conversationId;
});
morgan.token('session-id', function getSessionId(req) {
    return req.sessionId;
});
morgan.token('instance-id', function getInstanceId(req) {
    return req.instanceId;
});
morgan.token('hostname', function getHostname() {
    return os.hostname();
});
morgan.token('pid', function getPid() {
    return process.pid;
});

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const networkLogger = function loggingMiddleware() {
    return morgan(jsonFormat,{
        stream: fs.createWriteStream(`${logDir}/network-trace.log`, {flags: 'a'})
    });
};


function jsonFormat(tokens, req, res) {
    return JSON.stringify({
        'remote-address': tokens['remote-addr'](req, res),
        'time': tokens['date'](req, res, 'iso'),
        'method': tokens['method'](req, res),
        'url': tokens['url'](req, res),
        'http-version': tokens['http-version'](req, res),
        'status-code': tokens['status'](req, res),
        'content-length': tokens['res'](req, res, 'content-length'),
        'referrer': tokens['referrer'](req, res),
        'user-agent': tokens['user-agent'](req, res),
        'conversation-id': tokens['conversation-id'](req, res),
        'session-id': tokens['session-id'](req, res),
        'hostname': tokens['hostname'](req, res),
        'instance': tokens['instance-id'](req, res),
        'pid': tokens['pid'](req, res)
    });
}

module.exports = networkLogger;