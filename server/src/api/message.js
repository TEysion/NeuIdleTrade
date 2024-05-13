var express = require('express');
var router = express.Router();
const {conductSqlSafe} = require('../util/EDb');
const { send, sendJSON, resErrSend, resSuccSend } = require('../util/ERes');
var datetime = require('silly-datetime');
const {ErrCode} = require('../util/ErrCode');
//获取朋友列表
router.post('/getFriends', (req, res) => {
    var params = req.body;
    var sess = req.session;
    var loginUserID = sess.loginUserID;
    conductSqlSafe(res, req, "select * from v_friend_with_info where user_id=?", [loginUserID], function (err, result) {
        if (result) {
            resSuccSend(res, result);
        }
    })
});

//发送消息
router.post('/sendMessage', (req, res) => {
    var params = req.body;
    var sess = req.session;
    var loginUserID = sess.loginUserID;
    var friendID = params.friend_user_id;
    var content = params.message_content;
    var msgType = params.type;
    conductSqlSafe(res, req, "insert into message(message_sender,message_receiver,message_type,message_content,message_time) values(?,?,?,?,?)", [loginUserID, friendID, msgType, content, datetime.format(new Date(), 'YYYY-MM-DD HH:mm:ss')], function (err, result) {
        if (result) {
            resSuccSend(res, result);
        }
    })
});


//获取新消息数量
router.post('/getNewMessageNum', (req, res) => {
    var params = req.body;
    var sess = req.session;
    var loginUserID = sess.loginUserID;
    let fuid = params.fuid;
    conductSqlSafe(res, req, "select unread_num from v_friend where user_id=? and friend_id=?", [loginUserID, fuid], function (err, result) {
        if (result) {
            resSuccSend(res, result[0].unread_num);
        }
    })
});

//获取消息设为已读
router.post('/getMessages', (req, res) => {
    var params = req.body;
    var sess = req.session;
    var loginUserID = sess.loginUserID;
    var friendID = params.friend_user_id;
    console.log("获取消息 f id is", friendID, 'uid is ', loginUserID)
    conductSqlSafe(res, req, "select * from message where message_sender = ? and message_receiver = ? OR message_sender = ? and message_receiver = ?;", [loginUserID, friendID, friendID, loginUserID], function (err, result) {
        if (result) {
            conductSqlSafe(res, req, "update message set message_read=true where message_sender = ? and message_receiver = ?;", [friendID, loginUserID], function (err, result) {
            })
            resSuccSend(res, result);
        }
    })
});

module.exports = router;