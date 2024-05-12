var express = require('express');
var router = express.Router();

var multer = require('multer');
var path = require('path')
var UUID = require('uuid')

const { appLog } = require('../util/ELog');
const { send } = require('../util/ERes');
const { compress } = require('../util/EPhoto')




var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/public/uploads')
    },
    filename: function (req, file, cb) {
        var str = file.originalname.split('.');
        cb(null, UUID.v1() + '.' + str[1]);
    }
})

const appRoot = path.resolve(__dirname, '../..');

router.all('*', function (req, res, next) {
    console.log("请求源：" + req.headers.origin + " " + req.ip)
    var sess = req.session;
    var loginUserID = sess.loginUserID;
    console.log("用户", loginUserID)
    appLog.info(req, "请求源" + req.headers.origin + " " + req.ip + " 用户" + loginUserID)

    res.header('Access-Control-Allow-Origin', req.headers.origin/* 'http://localhost:3001'*/);
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

// 获取用户信息
router.post('/', (req, res) => {
    var params = req.body;
    var sess = req.session;
    var loginUserID = sess.loginUserID;
    res.status(200).send({ user_id: loginUserID });
});
// 检查是否登录中间件，若未登录则禁止请求
function requestLogin(req, res) {

}

//获取原图
router.get('/getPicture/origin/:filename', (req, res) => {
    console.log("请求图片")
    var filename = req.params.filename;
    console.log("请求图片：" + filename)

    let path = `${appRoot}/static/public/uploads/${filename}`;
    let path_slt = `${appRoot}/static/public/slt/${filename}`;

    // 使用 sharp 库读取输入文件
    compress(path, path_slt, (err, path_slt) => {
        if(err) {
            send(res, 1, '不存在的图片');
        }
        else {
            res.sendFile(path_slt);
        }
    }, 50)


});

//获取压缩图片
router.get('/getPicture/:filename', (req, res) => {
    console.log("请求图片")
    var filename = req.params.filename;
    console.log("请求图片：" + filename)

    let path = `${appRoot}/static/public/uploads/${filename}`;
    let path_slt = `${appRoot}/static/public/slt/${filename}`;

    // 使用 sharp 库读取输入文件
    compress(path, path_slt, (err, path_slt) => {
        if(err) {
            send(res, 1, '不存在的图片');
        }
        else {
            res.sendFile(path_slt);
        }
    })


});


module.exports = router;
