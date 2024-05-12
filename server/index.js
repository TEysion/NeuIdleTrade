const userApi = require('./src/api/user');
const commonApi = require('./src/api/common');
const goodsApi = require('./src/api/goods');
const orderApi = require('./src/api/order');
const reportApi = require('./src/api/report');
const messageApi = require('./src/api/message');
var session = require('express-session');
var FileStore = require('session-file-store')(session);


const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
// require('express-async-errors');
const app = express();
const { appLog } = require('./src/util/ELog');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
var identityKey = 'skey';
app.use(session({
    name: identityKey,
    secret: 'braydensapp_neuxinayi',  // 用来对session id相关的cookie进行签名
    store: new FileStore(),  // 本地存储session（文本文件，也可以选择其他store，比如redis的）
    saveUninitialized: false,  // 是否自动保存未初始化的会话，建议false
    resave: true,  // 是否每次都重新保存会话，建议false
    cookie: {
        maxAge: 120 * 3600 * 1000  // 有效期，单位是毫秒 1000s
    }
}));
// 后端api路由
app.use('/api/user', userApi);
app.use('/api/common', commonApi);
app.use('/api/goods', goodsApi);
app.use('/api/order', orderApi);
app.use('/api/report', reportApi);
app.use('/api/message', messageApi);
// 监听端口

function errorHandler(err, req, res, next) {
    appLog.error(req, err.stack);
    console.log("!ERR!", err.stack);
    res.status(201).send("服务器错误");
    next(err);
}

app.use(errorHandler);


app.listen(4534);
console.log('success listen at port:4534......');