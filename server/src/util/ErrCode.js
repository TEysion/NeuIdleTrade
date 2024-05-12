const ErrCode = {
    DB_CONNECT_FAILED: {
        status: 504,
        code: 50001,
        message: '数据库连接失败',
    },
    DB_SQL_FAILED: {
        status: 500,
        code: 50002,
        message: '数据库查询错误',
    },
    SERVER_INNER_ERR: {
        status: 500,
        code: 50003,
        message: '后端内部错误',
    },

    REPEAT_OPERATION: {
        status: 403,
        code: 40001,
        message: '重复操作',
    },
    NOT_PERMITTED: {
        status: 403,
        code: 40002,
        message: '你没有权限',
    },

    ACCOUNT_NOT_FOUND: {
        status: 403,
        code: 40003,
        message: '账号不存在',
    },
    LOGIN_FAILD: {
        status: 403,
        code: 40004,
        message: '账号或密码错误',
    },
    NOT_LOGIN: {
        status: 403,
        code: 40005,
        message: '尚未登录',
    },

};

module.exports = { ErrCode };