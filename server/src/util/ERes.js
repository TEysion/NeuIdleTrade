'use strict';

const { appLog } = require("./ELog");

function send(res, code, content) {
    res.status(200).send({ code: code, text: content });
}

function sendJSON(res, obj) {
    console.log("发送了哦")
    res.status(200).send({ code: 0, obj: obj });
    console.log("发送完了")
}

function resErrSend(res, errCode) {
    try {
        res.status(errCode.status).send({ code: errCode.code, message: errCode.message });
    }
    catch (e) {
        appLog.error(null, e);
    }
}

function resSuccSend(res, message) {
    try {
        res.status(200).send({ code: 0, message: message });
    }
    catch (e) {
        appLog.error(null, e);
    }
}

module.exports = { send, sendJSON, resErrSend, resSuccSend };
// exports.ELog = ELog;