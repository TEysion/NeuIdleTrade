'use strict';

const fs = require('fs');
const deletePhoto = (photoName) => {
    try {
        console.log("删除", pictures[i])
        fs.unlinkSync('static/public/uploads/' + pictures[i]);
    }
    catch(e) {
        console.log("删除错误", e);
    }
}

const sharp = require('sharp');
// 获取文件的宽度和高度
function getFileDimensions(path) {
    const fileData = fs.readFileSync("static/public/uploads/" + path); // 读取本地文件
    return new Promise((resolve, reject) => {
        sharp(fileData)
            .metadata()
            .then((metadata) => {
                const { width, height } = metadata;
                resolve({ width, height });
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// 压缩
function compress(path, path_slt, func, quality=1)
{
    try {
        path_slt=path_slt+"_"+quality;
        fs.access(path_slt, fs.constants.F_OK, (err) => {
            // 不存在
            if (err) {
                console.log('不存在');
                sharp(path)
                    .webp({ quality: quality })
                    .toFile(path_slt, (err) => {
                        try {
                            if (err) {
                                // console.error(`转换文件 ${filename} 出错:`, err);
                                // res.status(201).send("服务器错误" + err);
                                func(err);
                            } else {
                                // console.log(`文件 ${filename} 转换完成`);
                                // res.sendFile(path_slt)
                                func(err, path_slt)
                            }
                        } catch (err) {
                            // next(err)
                            func(err)
                            console.warn(err)
                        }
                    });
            }
            else {
                // console.log("存在");
                // res.sendFile(path_slt)
                func(err, path_slt)
            }
        });

    }
    catch (err) {
        // next(err)
        // res.status(201).send("服务器错误" + err);
        func(err);
    }
}

module.exports = { deletePhoto,getFileDimensions,compress };

