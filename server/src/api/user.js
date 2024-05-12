var express = require('express');
var router = express.Router();
var multer = require('multer');
var session = require('express-session');
var UUID = require('uuid')
const { send, sendJSON, resSuccSend, resErrSend } = require('../util/ERes');
const { ErrCode } = require('../util/ErrCode');
const { conductSqlSafe } = require('../util/EDb');
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


// 用户注册
router.post('/register', (req, res) => {
    var params = req.body;
    conductSqlSafe(res, req, "select user_id, user_password from user where user_id=?", [params.id], function (err, result) {
        if (result) {
            if (result.length > 0) {
                res.json({ ret_code: 1, ret_msg: '该学号/工号已注册！' + result[0].user_id + result[0].user_password });
            } else {
                conductSqlSafe(res, req, "INSERT INTO user(user_id,user_nickname,user_password, user_avatar) VALUES(?,?,?,?)", [params.id, params.nick, params.password, 'defaultavatar1.jpeg'], function (err, result) {
                    if (err) {
                        res.json({ ret_code: 1, ret_msg: err });
                    }
                    if (result) {
                        res.json({ ret_code: 0, ret_msg: '注册成功' });
                    }
                })
            }
        }
    })
});

// 登录接口
router.post('/login', function (req, res, next) {

    var sess = req.session;
    var params = req.body;
    conductSqlSafe(res, req, "select * from user where user_id=?", [params.id], function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            if (result.length == 0) {
                resErrSend(res, ErrCode.ACCOUNT_NOT_FOUND);
            } else {
                if (result[0].user_password == params.password) {
                    req.session.loginUserID = result[0].user_id;
                    resSuccSend(res, result)
                }
                else {
                    resErrSend(res, ErrCode.LOGIN_FAILD);
                }
            }
        }
    })
});

// 退出登录
router.post('/logout', function (req, res, next) {

    var sess = req.session;
    var params = req.body;
    req.session.destroy();
    resSuccSend(res, '注销成功');
});


// 编辑信息
router.post('/editProfile', (req, res) => {
    var params = req.body;
    conductSqlSafe(res, req, "update user set user_nickname=?,user_fullname=?,user_phone=?,user_age=?,user_institute=?,user_qq=?,user_wechat=?,user_mysign=?, user_gender=? where user_id=?", [params.nick, params.truename, params.phone, params.age, params.institute, params.qq, params.wechat, params.selfsign, params.gender, params.id], function (err, result) {
        if (result) {
            resSuccSend(res, result);
        }
    })
});

//上传头像
router.post('/uploadAvatar', upload.single('file'), (req, res) => {
    var params = req.body;
    try {
        fs.unlinkSync('static/public/uploads/' + params.oldheadphoto);
    } catch (e) { }
    conductSqlSafe(res, req, "update user set user_avatar=? where user_id=?", [req.file.filename, params.id], function (err, result) {
        if (result) {
            resSuccSend(res, {
                'headphoto': req.file.filename
            });
        }
    })
});

// 获取用户信息
router.post('/getUserinfo', (req, res) => {
    var params = req.body;
    var sess = req.session;
    var loginUserID = sess.loginUserID;
    var user_id = params.user_id;

    conductSqlSafe(res, req, "select * from user where user_id=?", [user_id ? user_id : loginUserID], function (err, result) {
        if (result) {
            resSuccSend(res, result);
        }
    })
});






// 修改密码
router.post('/modifyPsd', requestSysMgr, (req, res) => {
    var params = req.body;
    conductSqlSafe(res, req, "select * from user where user_id=?", [params.id], function (err, result) {
        if (result) {
            conductSqlSafe(res, req, "update user set user_password=? where user_id=?", [params.newpsd, params.id], function (err, result) {
                if (result) {
                    res.json({ ret_code: 0, ret_msg: '修改成功' });
                    resSuccSend(res, '成功');
                }
            })
        }
    })
});



// 检查是否为超级管理员中间件
function requestSysMgr(req, res, next) {
    var sess = req.session;
    var loginUserID = sess.loginUserID;
    if(loginUserID === 2) {
        console.log('超级管理员鉴权通过');
        next();
    }
    else {
        console.log('超级管理员鉴权失败');
        resErrSend(res, ErrCode.NOT_PERMITTED);
    }
}


// 获取所有用户（超级管理员）
router.post('/getAllUsers', requestSysMgr, (req, res) => {
    var params = req.body;
    conductSqlSafe(res, req, "select * from user", [], function (err, result) {
        resSuccSend(res, result);
    })
});


// 设为管理员（超级管理员）
router.post('/grantManager', requestSysMgr, (req, res) => {
    var params = req.body;
    conductSqlSafe(res, req, "update user set user_role=2 where user_id=?", [params.user_id], function (err, result) {
        resSuccSend(res, result);
    })
});

// 取消管理员（超级管理员）
router.post('/revokeManager', requestSysMgr, (req, res) => {
    var params = req.body;
    conductSqlSafe(res, req, "update user set user_role=0 where user_id=?", [params.user_id], function (err, result) {
        resSuccSend(res, result);
    })
});


// 重置密码（超级管理员）
router.post('/resetPassword', requestSysMgr, (req, res) => {
    var params = req.body;
    conductSqlSafe(res, req, "update user set user_password=? where user_id=?", [params.user_id, params.user_id], function (err, result) {
        resSuccSend(res, result);
    })
});


module.exports = router;