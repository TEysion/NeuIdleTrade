var express = require('express');
var router = express.Router();
const {conductSqlSafe} = require('../util/EDb');
const { send, sendJSON, resSuccSend, resErrSend } = require('../util/ERes');



// 获取所有未处理举报和我已处理举报
router.post('/getReports', (req, res) => {
    var sess = req.session;
    var loginUserID = sess.loginUserID;
    var params = req.body;
    conductSqlSafe(res, req, `select report_goods as goods_id, null as ban_reason from report where report_goods not in (select ban_goods from ban) 
                              union select ban_goods as goods_id, ban_reason from ban where ban_user=?`, [loginUserID], function (err, result) {
        if (result) {
            resSuccSend(res, result);
        }
    })
});
// 举报商品
router.post('/reportGoods', (req, res) => {
    var params = req.body;
    var sess = req.session;
    var loginUserID = sess.loginUserID;
    conductSqlSafe(res, req, "insert into report(report_goods, report_user, report_reason) values(?,?,?);", [params.report_goods, loginUserID, params.report_reason], function (err, result) {
        if (result) {
            resSuccSend(res, "成功");
        }
    })
});

// 获取商品理由
router.post('/getReportByGoods', (req, res) => {
    var params = req.body;
    var sess = req.session;
    var loginUserID = sess.loginUserID;
    conductSqlSafe(res, req, "select * from report where report_goods=?;", [params.report_goods], function (err, result) {
        if (result) {
            resSuccSend(res, result);
        }
    })
});

// 管理员下架商品
router.post('/banGoods', (req, res) => {
    var params = req.body;
    var sess = req.session;
    var loginUserID = sess.loginUserID;
    let msg = { goods_id: params.ban_goods, text: '对于商品号为' + params.ban_goods + '的举报我们已经处理完毕，处理结果为：对于您所举报的商品，我们认定其有违规行为，并已进行下架处理，感谢您的反馈' }
    conductSqlSafe(res, req, "insert into ban(ban_goods, ban_user, ban_reason) values(?,?,?);", [params.ban_goods, loginUserID, params.ban_reason], function (err, result) {
        if (result) {
            resSuccSend(res, "成功");
            conductSqlSafe(res, req, `INSERT INTO message (message_sender, message_receiver, message_type, message_content, message_time)
            SELECT 1 AS message_sender,
                   report_user AS message_receiver,
                   88 AS message_type,
                   '${JSON.stringify(msg)}' AS message_content,
                   CURRENT_TIMESTAMP AS message_time
            FROM report
            WHERE report_goods =? AND report_result = 0;
            `, [params.ban_goods], function (err, result) {
                console.log(err)
                if (result) {
                    conductSqlSafe(res, req, 'update `report` set report_result=1 where report_goods=?', [params.ban_goods], function (err, result) {

                    })
                }
            })

        }
    })
});

//管理员驳回举报信息
router.post('/rejectReport', (req, res) => {
    var params = req.body;
    var sess = req.session;
    var loginUserID = sess.loginUserID;

    let msg = { goods_id: params.ban_goods, text: '对于商品号为' + params.ban_goods + '的举报我们已经处理完毕，处理结果为：我们已经对您的举报理由进行评审，并将密切观察该商品的动向，如有违规，即刻下架' }

    conductSqlSafe(res, req, `INSERT INTO message (message_sender, message_receiver, message_type, message_content, message_time)
            SELECT 1 AS message_sender,
                   report_user AS message_receiver,
                   88 AS message_type,
                   '${JSON.stringify(msg)}' AS message_content,
                   CURRENT_TIMESTAMP AS message_time
            FROM report
            WHERE report_goods =? AND report_result = 0;
            `, [params.ban_goods], function (err, result) {
        if (result) {
            resSuccSend(res, '成功');
            conductSqlSafe(res, req, 'update `report` set report_result=1 where report_goods=?', [params.ban_goods], function (err, result) {

            })
        }
    })

});

module.exports = router;