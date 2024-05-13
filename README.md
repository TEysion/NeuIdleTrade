# 东大闲易

## 项目简介

- 此项目为软件工程大作业实践项目
- 项目使用express开发后端，使用vue开发前端，使用mysql数据库
- 用户包括普通用户，管理员用户，系统管理员用户（若下载代码进行本地部署，则账号为`2`，密码为`admin`）
- 项目人员：庄志宇 葛政锟 汪飞 赖泓峰 王宇暄
- 在线体验网址：[东大闲易](http:101.43.158.82:5633)


## 项目背景

- 在数字化和移动互联网快速发展的今天，二手交易市场展现出巨大的增长潜力。尤其在大学校园内，二手交易平台不仅能帮助学生经济高效地处理自己不再需要的物品，同时也为寻找便宜和特色物品的学生提供了极大的便利。然而，现有的二手交易平台常常面临着信息不透明、交易安全性不足和用户体验差等问题。

## 用户类别

- 普通用户：系统的主要用户。可以使用系统大部分功能，包括浏览商品，搜索商品，查看商品详情，举报商品，查看卖家信息，查看卖家已卖商品与评价，联系卖家，向卖家发送指定商品，发布商品，下架自己的商品，查看消息，发送订单消息，查看已买商品，评价已买商品，查看在卖商品，修改个人信息，修改头像，修改密码，收藏商品。

- 管理员：被授予商品管理权限的用户。相比于普通用户，增加了举报管理功能，可以查看每个商品的被举报情况，可以对举报信息进行驳回，可以强制下架问题商品。

- 系统管理员：对系统进行管理的人员。对系统订单进行统计分析，对商品进行管理，可以查看商品信息与下架商品，对用户进行管理，可以查看用户信息，可以重置用户密码，可以授予和撤销用户管理员权限。


## 目录结构

```
  NeuIdleTrade
    ├─server                后端Express项目根目录
    │  └─src                源代码目录
    │     ├─api             接口代码
    │     ├─config          配置项
    │     └─util            通用工具代码
    └─web                   前端Vue项目根目录
        ├─public            资源目录
        └─src               源代码目录
            ├─assets        通用样式目录
            ├─components    组件代码目录
            ├─router        路由代码目录
            └─stores        状态管理代码目录

```

## 本地部署方式

0. 环境准备

- 请确保已安装MySQL和Node.js
- 且已全局安装yarn包管理器

1. 拉取项目代码

```bash
git clone https://github.com/TEysion/NeuIdleTrade.git
```


2. 进入数据库


```bash
# 进入项目文件夹
cd NeuIdleTrade
# 选择合适的方式登入mysql，举例如下
mysql -uroot
```

3. 后端数据库准备

```sql
-- 创建数据库
CREATE DATABASE idletrade;
-- 使用此数据库
USE idletrade
-- 使用备份文件恢复数据库
SOURCE idletrade.sql
-- 为后端连接数据库创建用户
CREATE USER 'idletrade_express_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'idletrade_express_user_password';
GRANT ALL PRIVILEGES ON idletrade.* TO 'idletrade_express_user'@'localhost';
```

4. 文件配置

- 将 `/server/src/config/db.js.sample` 文件的 `.sample` 后缀删掉
- 将 `/server/src/config/session.js.sample` 文件的 `.sample` 后缀删掉


5. 启动后端
```bash
# 进入后端根目录
cd server
# 依赖准备
yarn
yarn add sharp --ignore-engines
# 启动
node index.js
```

6. 启动前端
```bash
# 进入前端根目录
cd web
# 依赖准备
yarn
# 启动
yarn run dev
```

7. 浏览器访问 [http://localhost:5173](http://localhost:5173)

