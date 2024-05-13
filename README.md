# 东大闲易

## 项目介绍

> 此项目为软件工程大作业实践项目
>
> 项目使用express开发后端，使用vue开发前端，使用mysql数据库
>
> 用户包括普通用户，管理员用户，系统管理员用户（若下载代码进行本地部署，则账号为`2`，密码为`admin`）
> 
>
> 项目人员：庄志宇 葛政锟 汪飞 赖泓峰 王宇暄
>


## 在线体验网址
 [东大闲易](http:101.43.158.82:5633)


## 本地部署方式

0. 环境准备

> 请确保已安装MySQL和Node.js，且已全局安装yarn包管理器

1. 拉取项目代码

```bash
git clone https://github.com/TEysion/NeuIdleTrade.git
```


2. 后端数据库准备


```bash
# 进入项目文件夹
cd NeuIdleTrade
# 选择合适的方式登入mysql，举例如下
mysql -uroot
```
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

3. 文件配置
> 将 `/server/src/config/db.js.sample` 文件的 `.sample` 后缀删掉
>

4. 启动后端
```bash
# 进入后端根目录
cd server
# 依赖准备
yarn
yarn add sharp --ignore-engines
# 启动
node index.js
```

5. 启动前端
```bash
# 进入前端根目录
cd web
# 依赖准备
yarn
# 启动
yarn run dev
```

6. 浏览器访问`http://localhost:5173`

