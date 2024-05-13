var express = require('express');
var router = express.Router();
var multer = require('multer');
const { conductSqlSafe } = require('../util/EDb');
const { getFileDimensions } = require('../util/EPhoto');
const { ErrCode } = require('../util/ErrCode');

const { resErrSend, resSuccSend } = require('../util/ERes');
const fs = require('fs');
var UUID = require('uuid')
var datetime = require('silly-datetime');

const { deletePhoto } = require('../util/EPhoto');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/public/uploads')
    },
    filename: function (req, file, cb) {
        var str = file.originalname.split('.');
        cb(null, UUID.v1() + '.' + str[1]);
    }
})
var upload = multer({ storage: storage })

function excludes2str(excludes) {
    let ans = [-1];
    for (let i = 0; i < excludes.length; i++) {
        const [start, end] = excludes[i];
        for (let j = start; j <= end; j++) {
            ans.push(j)
        }
    }
    return ans;
}

// 检查是否登录中间件，若未登录则禁止请求
function requestLogin(req, res, next) {
    var sess = req.session;
    var loginUserID = sess.loginUserID;
    if (loginUserID) {
        console.log('已登录');
        next();
    }
    else {
        console.log('未登录');
        resErrSend(res, ErrCode.NOT_LOGIN);
    }
}


// 检查是否为超级管理员登录中间件，若未登录则禁止请求
function requestSuperLogin(req, res, next) {
    var sess = req.session;
    var loginUserID = sess.loginUserID;

    conductSqlSafe(res, req, "select * from user where user_id=? and user_role=-2", [loginUserID], function (err, result) {
        if (result && result.length > 0) {
            next();
        }
        else {
            resErrSend(res, ErrCode.NOT_PERMITTED);
        }
    })
}


// 新版获取商品列表，同时返回了图片的宽高
router.post('/getGoodsList', requestLogin, (req, res) => {
    var sess = req.session;
    var loginUserID = sess.loginUserID;
    var params = req.body;
    var searchtext = params.searchtext;

    let number = params.number;
    let excludes = params.excludes;

    let sqlParams = [excludes2str(excludes), number];
    let selectsql = `SELECT g.*
                FROM v_goods_without_ban g
                LEFT JOIN 
                \`order\` o ON g.goods_id = o.order_goods
                WHERE 
                g.goods_id NOT IN (?) and o.order_goods is null
                ${searchtext ? 'and (g.goods_name like "%' + searchtext.trim() + '%" or g.category_name like "%' + searchtext.trim() + '%")' : ''}
                ORDER BY 
                g.goods_listingtime DESC
                LIMIT ?;`
    conductSqlSafe(res, req, selectsql, sqlParams, function (err, result) {
        if (result) {
            resSuccSend(res, result);
        }
    })
});

// 发布商品
router.post('/addGoods', requestLogin, upload.array('file', 10), (req, res) => {
    var sess = req.session;
    var loginUserID = sess.loginUserID;
    var params = req.body;
    var goods_picture = "";
    if (!req.files
        || req.files.length === 0
        || !params.goodsname
        || !params.oldprice
        || !params.price
        || !params.goodstype
        || !params.recommend
        || !params.goodsnewold) {
        console.log("价格",!params.oldprice, !params.price)
        for (var i = 0; req.files && i < req.files.length; i++) {
            fs.unlinkSync('static/public/uploads/' + req.files[i].filename)
        }
        resErrSend(res, ErrCode.NOT_COMPLETED_PARAMS);
        return;
    }


    console.log("价格",params.oldprice, params.price)

    for (var i = 0; i < req.files.length; i++) {
        if (i != 0) goods_picture += "#"
        goods_picture += req.files[i].filename
    }
    conductSqlSafe(res, req, "insert into goods(goods_name,goods_originprice,goods_price,goods_category,goods_desc,goods_photo,goods_seller,goods_listingtime,goods_condition) values(?,?,?,?,?,?,?,?,?)", [/*UUID.v1(),*/params.goodsname, params.oldprice, params.price, params.goodstype, params.recommend, goods_picture, loginUserID, datetime.format(new Date(), 'YYYY-MM-DD HH:mm:ss'), params.goodsnewold], function (err, result) {
        if (err) {
            for (var i = 0; i < req.files.length; i++) {
                fs.unlinkSync('static/public/uploads/' + req.files[i].filename)
            }
            resErrSend(res, ErrCode.DB_SQL_FAILED);
        }
        if (result) {
            conductSqlSafe(res, req, "select LAST_INSERT_ID()", [], function (err, result) {
                if (err) {
                    console.log(err);
                    resErrSend(res, ErrCode.DB_SQL_FAILED);
                }
                else {
                    let goods_id = result[0]["LAST_INSERT_ID()"]
                    const txt = goods_picture;
                    const paths = txt.split('#'); // 按 '#' 分割字符串
                    paths.forEach((path, index) => {
                        try {
                            getFileDimensions(path)
                                .then(({ width, height }) => {
                                    conductSqlSafe(res, req, 'INSERT INTO goods_picture (goods_id, picture_order, picture_path, picture_width, picture_height) VALUES (?, ?, ?, ?, ?)',
                                        [goods_id, index, path, width, height],
                                        (err, result) => {
                                            if (err) {
                                                console.error('向数据库插入数据失败：', err);
                                                return;
                                            }
                                            console.log(`成功插入一条记录到 goods_pictures 表：${path}`);
                                        }
                                    );
                                })
                                .catch((error) => {
                                    console.error('获取文件宽度和高度时发生错误:', error);
                                });
                            resSuccSend(res, '成功');
                        }
                        catch (e) {
                            console.log(e)
                        }
                    });
                }
            })
        }
    })
});

// 获取类别
router.post('/getCategory', requestLogin, (req, res) => {
    conductSqlSafe(res, req, "select * from category order by category_id", [], function (err, result) {
        if (result) {
            resSuccSend(res, result);
        }
    })
});

// 商品明细
router.post('/getGoodsInfo', requestLogin, (req, res) => {
    var params = req.body;
    let goods_id = params.id;
    var sess = req.session;
    var loginUserID = sess.loginUserID;



    conductSqlSafe(res, req, `select vg.*, vb.*, IF(c.cart_goods IS NOT NULL, 1, 0) AS collected
                            from v_goods vg, v_goods_with_ban_info vb
                            LEFT JOIN cart c ON vb.goods_id = c.cart_goods AND c.cart_user=?
                            where
                            vg.goods_id=?
                            and vb.goods_id=vg.goods_id;`,
        [loginUserID, goods_id], function (err, result) {
            if (result) {
                resSuccSend(res, result);
            }
        })
});

// 添加收藏
router.post('/addToCart', requestLogin, (req, res) => {
    var sess = req.session;
    var loginUserID = sess.loginUserID;
    var params = req.body;
    console.log("添加收藏")
    conductSqlSafe(res, req, "select * from cart where cart_goods=? and cart_user=?", [params.goodsid, loginUserID], function (err, result) {
        if (result) {
            if (result.length > 0) {
                console.log("重复添加")
                resErrSend(res, ErrCode.REPEAT_OPERATION);
            } else {
                conductSqlSafe(res, req, "INSERT INTO cart(cart_goods,cart_user,cart_addtime) VALUES(?,?,?)", [params.goodsid, loginUserID, datetime.format(new Date(), 'YYYY-MM-DD HH:mm:ss')], function (err, result) {
                    if (result) {
                        console.log("成功")
                        resSuccSend(res, '收藏成功');
                    }
                })
            }
        }
    })
});

// 取消收藏
router.post('/removeFromCart', requestLogin, (req, res) => {
    var sess = req.session;
    var loginUserID = sess.loginUserID;
    var params = req.body;
    conductSqlSafe(res, req, "select * from cart where cart_goods=? and cart_user=?", [params.goodsid, loginUserID], function (err, result) {
        if (result) {
            if (result.length > 0) {
                conductSqlSafe(res, req, "delete from cart where cart_goods=? and cart_user=?", [params.goodsid, loginUserID], function (err, result) {
                    if (result) {
                        console.log("成功")
                        resSuccSend(res, '取消成功');
                    }
                })
            } else {
                console.log("重复取消")
                resErrSend(res, ErrCode.REPEAT_OPERATION);
            }
        }
    })
});


//获取我的收藏
router.post('/getCart', requestLogin, (req, res) => {
    var params = req.body;
    conductSqlSafe(res, req, "select * from v_cart where cart_user=? order by cart_addtime DESC", [params.id], function (err, result) {
        if (result) {
            resSuccSend(res, result);
        }
    })
});

//下架商品
router.post('/deleteGoods', requestLogin, (req, res) => {
    var params = req.body;
    var sess = req.session;
    var loginUserID = sess.loginUserID;
    // 查询当前用户是否有删除权限
    conductSqlSafe(res, req, "select user_id T from user, goods where goods_id=? and user_id=goods_seller and user_id=? union select user_id T from user where user_id=? and (user_role=2 or user_role=-2)", [params.goods_id, loginUserID, loginUserID], function (err, result) {
        if (result.length == 0) {
            resErrSend(res, ErrCode.NOT_PERMITTED);
            return;
        }
        conductSqlSafe(res, req, "select picture_path, goods_seller from goods_picture, goods where goods_picture.goods_id=? and goods_picture.goods_id=goods.goods_id", [params.goods_id], function (err, result) {
            if (result) {
                console.log(result)
                var pictures = result.map(item => { return item.picture_path });
                console.log("要删除", pictures)
                for (var i = 0; i < pictures.length; i++) {
                    deletePhoto(pictures[i])
                }
                conductSqlSafe(res, req, "delete from goods where goods_id=?", [params.goods_id], function (err, result) {
                    resSuccSend(res, '成功');
                })

            }
        })
    })
});

// 检查是否为超级管理员中间件
function requestSysMgr(req, res, next) {
    var sess = req.session;
    var loginUserID = sess.loginUserID;
    if (loginUserID === 2) {
        console.log('超级管理员鉴权通过');
        next();
    }
    else {
        console.log('超级管理员鉴权失败');
        resErrSend(res, ErrCode.NOT_PERMITTED);
    }
}




// 获取所有商品（超级管理员）
router.post('/getAllGoods', requestSysMgr, (req, res) => {
    var params = req.body;

    conductSqlSafe(res, req, "select * from goods", [], function (err, result) {
        if (result) {
            resSuccSend(res, result);
        }
    })
});



module.exports = router;