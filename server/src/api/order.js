var express = require('express');
var router = express.Router();
const {conductSqlSafe} = require('../util/EDb');
const { send, resErrSend, resSuccSend } = require('../util/ERes');
const {ErrCode} = require('../util/ErrCode');
var datetime = require('silly-datetime');

// 创建订单
router.post('/createOrder', (req, res) => {
    var params = req.body;
    var sess = req.session;
    var loginUserID = sess.loginUserID;

    // TODO
    // 检查当前用户是否为当前商品的卖家
    
    conductSqlSafe(res, req, "insert into `order`(order_goods,order_addr,order_create_time,order_deal_time,order_state, order_buyer) values(?,?,?,?,?,?)", [params.goods_id, params.addr, datetime.format(new Date(), 'YYYY-MM-DD HH:mm:ss'), datetime.format(new Date(params.dateTime), 'YYYY-MM-DD HH:mm:ss'), 0, params.buyer], function (err, result) {
        if (result) {
            conductSqlSafe(res, req, "SELECT LAST_INSERT_ID();", [], function (err, result) {
                if (result) {
                    resSuccSend(res, result[0]["LAST_INSERT_ID()"]);
                }
            })
        }
    })
});

//获取订单
router.post('/getOrder', (req, res) => {
    var params = req.body;
    var sess = req.session;
    var loginUserID = sess.loginUserID;
    conductSqlSafe(res, req, "select * from v_order where order_id=?", [params.order_id], function (err, result) {
        if (result) {
            resSuccSend(res, result);
        }
    })
});


// 确认收货
router.post('/confirmGot', (req, res) => {
    var params = req.body;
    var sess = req.session;
    var loginUserID = sess.loginUserID;
    conductSqlSafe(res, req, "update `order` set order_state=2 where order_id=?", [params.order_id], function (err, result) {
        if (result) {
            resSuccSend(res, result);
        }
    })
});


//我的买入
router.post('/getBuyerOrder', (req, res) => {
    var params = req.body;
    var sess = req.session;
    var loginUserID = sess.loginUserID;
    conductSqlSafe(res, req, "select * from v_order where order_buyer=?", [loginUserID], function (err, result) {
        if (result) {
            resSuccSend(res, result);
        }
    })
});

//我的卖出
router.post('/getSellerOrder', (req, res) => {
    var params = req.body;
    var sess = req.session;
    var loginUserID = sess.loginUserID;
    conductSqlSafe(res, req, "select * from v_order where goods_seller=?", [loginUserID], function (err, result) {
        if (result) {
            resSuccSend(res, result);
        }
    })
});

//评论
// router.post('/reviewOrder', (req, res) => {
//     var params = req.body;
//     var sess = req.session;
//     var loginUserID = sess.loginUserID;
//     let order_id = params.order_id;
//     let rate = params.rate;
//     let review = params.review;
//     // TODO
//     // 检查是否有相关权限
//     // 检查是否多次评论

//     conductSqlSafe(res, req, "update `order` set order_score=?, order_comment=? where order_id=?", [rate, review, order_id], function (err, result) {
//         if (result) {
//             resSuccSend(res, result);
//         }
//     })
// });


//获取卖家在卖的商品
router.post('/getSellingGoodsByUID', (req, res) => {
    var sess = req.session;
    var loginUserID = sess.loginUserID;
    var params = req.body;
    let id = params.id ? params.id : loginUserID
    conductSqlSafe(res, req, "select * from v_goods_with_order where goods_seller=? order by goods_listingtime DESC", [id], function (err, result) {
        if (result) {
            resSuccSend(res, result);
        }
    })
});

//获取已买商品
router.post('/getPuchasedGoodsByUID', (req, res) => {
    var sess = req.session;
    var loginUserID = sess.loginUserID;
    var params = req.body;
    let id = params.id ? params.id : loginUserID
    conductSqlSafe(res, req, "select * from v_goods_with_order where order_buyer=? order by goods_listingtime DESC", [id], function (err, result) {
        if (result) {
            resSuccSend(res, result);
        }
    })
});

//确认订单
router.post('/confirmOrder', (req, res) => {
    var params = req.body;
    var sess = req.session;
    var loginUserID = sess.loginUserID;
    var order_id = params.order_id;
    var msgType = params.type;
    var frined_id = params.friend_id;
    conductSqlSafe(res, req, "update `order` set order_state=1 where order_id=?", [order_id], function (err, result) {
        if (result) {
            // resSuccSend(res, '成功');

            

            conductSqlSafe(res, req, "insert into message(message_sender,message_receiver,message_type,message_content,message_time) values(?,?,?,?,?)", [loginUserID, frined_id, 1, '我已确认订单', datetime.format(new Date(), 'YYYY-MM-DD HH:mm:ss')], function (err, result) {
                if (result) {
                    // resSuccSend(res, result);
                    resSuccSend(res, '成功');
                    // conductSqlSafe(res, req, "update message set message_read=0 where message_type=9 and message_content=? and message_receiver=?;", [order_id, loginUserID], function (err, result) {
                    //     if (result) {
                    //         resSuccSend(res, '成功');
                    //     }
                    // })

                    
                }
            })
            // conductSqlSafe(res, req, "update message set message_read=false where message_type = '9' and message_content = ?;", [order_id], function (err, result) {
            // })
        }
    })
});

//评论
router.post('/confirmReview', (req, res) => {
    var params = req.body;
    var sess = req.session;
    var loginUserID = sess.loginUserID;
    var order_id = params.order_id;
    let order_score = params.order_score;
    let order_comment = params.order_comment;
    // TODO
    // 检查是否有相关权限
    // 检查是否多次评论
    conductSqlSafe(res, req, "update `order` set order_score=?,order_comment=?,order_state=3 where order_id=?", [order_score, order_comment, order_id], function (err, result) {
        if (result) {
            resSuccSend(res, '成功');
        }
    })
});




//我的卖出
router.post('/getGoodsbyuser', (req, res) => {
    var params = req.body;
    conductSqlSafe(res, req, "select * from goods where goods_seller=?", [params.id], function (err, result) {
        if (result) {
            resSuccSend(res, result);
        }
    })
});




// 获取所有订单（超级管理员）
router.post('/getAllOrders', (req, res) => {
    var params = req.body;
    conductSqlSafe(res, req, "select * from `v_order`", [], function (err, result) {
        if (result) {
            resSuccSend(res, result);
        }
    })
});





module.exports = router;