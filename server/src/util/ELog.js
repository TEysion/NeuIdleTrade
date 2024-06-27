'use strict';

const fs = require('fs');
function toTimeString(dateobj) {
    let date = new Date(dateobj)
    let Y = date.getFullYear()
    let M = date.getMonth() + 1
    let D = date.getDate()
    let h = date.getHours()
    let m = date.getMinutes()
    let s = date.getSeconds()
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    return Y + '/' + M + '/' + D + ' ' + h + ':' + m + ':' + s;
}



class ELog {

    constructor(filename) {
        this._filename = filename;
    }

    getFileName() {
        let date = new Date()
        let dateStr = `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}`
        return this._filename + "_" + dateStr + ".log";
    }

    info(req, log) {
        let line = this.getTime() + ' ' + this.getUser(req) + ' INFO ' + log
        fs.appendFile(this.getFileName(), line + '\n', (err, data) => {
            if (err) console.log(err)
        });
    }
    error(req, log) {
        let line = this.getTime() + ' ' + this.getUser(req) + ' ERROR ' + log
        fs.appendFile(this.getFileName(), line + '\n', (err, data) => {
            if (err) console.log(err)
        });
    }

    warn(req, log) {
        let line = this.getTime() + ' ' + this.getUser(req) + ' WARN ' + log
        fs.appendFile(this.getFileName(), line + '\n', (err, data) => {
            if (err) console.log(err)
        });
    }

    getUser(req) {
        if (req == null)
            return '系统'
        var sess = req.session;
        if (sess == null)
            return '未知 ' + req.headers.origin + ' ' + req.ip;
        var loginUser = sess.loginUser;
        var loginUserID = sess.loginUserID;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        return loginUserID + ' ' + req.headers.origin + ' ' + ip + ' 【' + req.originalUrl + '】';
    }

    getTime() {
        return toTimeString(new Date())
    }
}

let appLog = new ELog("app");

module.exports = { ELog, appLog };
