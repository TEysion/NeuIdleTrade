var models = require('../config/db');
const { appLog } = require('./ELog');
const { send, sendJSON, resErrSend } = require('./ERes');
const { ErrCode } = require('./ErrCode');
var mysql = require('mysql');

var conn;
function handleError() {
    appLog.info(null, "连接数据库")
    //创建一个mysql连接对象
    conn = mysql.createConnection(models.mysql);

    //连接错误，2秒重试
    conn.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            appLog.warn(null, "连接失败")
            setTimeout(handleError, 2000);
        }
        else {
            appLog.info(null, "连接成功")
        }
    });
    //监听错误
    conn.on('Error', function (err) {
        console.log('db error', err);
        // 如果是连接断开，自动重新连接
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleError();
        } else {
            throw err;
        }
    });
}
handleError();




function conductSqlSafe(res, req, presql, params, func) {
    appLog.info(req, '执行查询 ' + presql + " params:" + JSON.stringify(params))

    conn.query(presql, params, (err, ans, fields) => {
        if (err) {
            appLog.info(req, "查询错误：" + err)
            console.log("111")
            // 连接断开重连
            if (err.toString().indexOf("ECONNRESET") !== -1) {
                handleError()
                conductSqlSafe(res, req, presql, params, func)
            }
            else {
                console.log("222")
                appLog.info(req, "查询错误：" + err)
                resErrSend(res, ErrCode.DB_SQL_FAILED)
                console.log("444")
                try {
                    func(err, ans)
                } catch (e) {
                    appLog.error(req, e)
                }
            }
        } else {
            // 将 MySQL 查询结果作为路由返回值
            console.log("333")
            appLog.info(req, "查询成功")
            try {
                func(err, ans)
            } catch (e) {
                resErrSend(res, ErrCode.SERVER_INNER_ERR)
                appLog.error(req, e)
            }
        }
    })
}
module.exports = {conductSqlSafe};