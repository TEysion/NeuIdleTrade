const userApi = require('./src/api/user');
const commonApi = require('./src/api/common');
const goodsApi = require('./src/api/goods');
const orderApi = require('./src/api/order');
const reportApi = require('./src/api/report');
const messageApi = require('./src/api/message');

const bodyParser = require('body-parser');
const express = require('express');
// require('express-async-errors');
const app = express();
const { appLog } = require('./src/util/ELog');
const { sess } = require('./src/config/session');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(sess);
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