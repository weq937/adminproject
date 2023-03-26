const express = require('express')
const admingoods = express.Router()
const db = require('../utils/db')
const checklogin=require('../utils/cheklogin')
const formidable = require('formidable')
const session=require('../utils/setsession')
const fs = require('fs')
const co = require('co')
const OSS = require('ali-oss')
const client = new OSS({
    region: 'oss-cn-beijing',
    accessKeyId: "****",
    accessKeySecret: "***",
    bucket: "weq01"
})

const ali_oss = {
    bucket: "weq01",
    endPoint: "oss-cn-beijing.aliyuncs.com"
}

admingoods.get('/goodslist',checklogin, (req, res) => {
    let sql = `select goods.id,goods.foodname,goods.descr,goods.price,goods.foodpic,shoplists.shopname from goods,shoplists where goods.shoplist_id=shoplists.id`
    db.query(sql, (err, data, fields) => {
        res.render('Admingoods/admingoodslist', {
            title: '商家食品列表',
            data: data,
            uname: req.session.uname
        })
    })
})

admingoods.get('/goodsadd',checklogin, (req, res) => {
    let sql = `select id,shopname from shoplists`
    db.query(sql, (err, data, fields) => {
        res.render('Admingoods/admingoodsadd', {
            title: '商品食品添加',
            data: data,
            uname: req.session.uname
        })
    })

})

// 食品添加操作

admingoods.post('/goodsdoadd', (req, res) => {
    const form = formidable({
        keepExtensions: true,
        uploadDir: './uploads',
        multiples: true
    })
    form.parse(req, (err, fields, files) => {
        let {
            foodname,
            descr,
            price,
            shoplist_id
        } = fields
        let {
            newFilename,
            filepath
        } = files.foodpic


        co(function* () {
            client.useBucket(ali_oss.bucket)
            var resutl = yield client.put(newFilename, filepath);
            fs.unlinkSync(filepath);
            res.end(JSON.stringify({
                status: '100',
                msg: '上传成功'
            }))
        }).catch((err) => {
            res.send(JSON.stringify({
                status: '101',
                msg: '上传失败',
                error: JSON.stringify(err)
            }))
        })
        let sql = `insert into goods(foodname,foodpic,descr,price,shoplist_id) values('${foodname}','${newFilename}','${descr}','${price}',${shoplist_id})`
        db.query(sql, (err, resutls, fields) => {
            if (resutls.affectedRows > 0) {
                res.redirect('/admin/goodslist')
            } else {
                res.redirect('/admin/goodsadd')
            }
        })

    })
})
// 
// 删除
admingoods.get('/goodsdel', (req, res) => {
    let {
        id
    } = req.query
    let sql = `delete from goods where id=${id}`
    db.query(sql, (err, resutls, fields) => {
        if (resutls.affectedRows > 0) {
            res.redirect('/admin/goodslist')
        } else {
            res.redirect('/admin/goodslist')
        }
    })
})


// 食品更新操作
admingoods.get('/goodsupdate', async (req, res) => {
    let {
        id
    } = req.query

    // 查找 shoplistname
    const pic = await getShoplistName()
    
    let sql = `select * from goods where id=${id}`
    db.query(sql, (err, resutl, fields) => {
        res.render('Admingoods/admingoodsupdate', {
            title: '商家更新',
            resutl: resutl[0],
            pic: pic,
            id:id,
        })
    })
})

function getShoplistName() {
    return new Promise((resolve, reject) => {
        let mql = `select id,shopname from shoplists`
        db.query(mql, (err, pic, fields) => {
            if (pic.length > 0) {
                resolve(pic)
            } else {
                resolve([])
            }
        })
    })
}
admingoods.post('/goodsdoupdate', (req, res) => {
    const form = formidable({
        keepExtensions: true,
        uploadDir: './uploads',
        multiples: true
    })
    form.parse(req, (err, fields, files) => {
        let {
            foodname,
            descr,
            price,
            shoplist_id,
            id
        } = fields
        // console.log(fields);
        let {
            newFilename,
            filepath,
            size
        } = files.foodpic
        if (size > 0) {
            co(function* () {
                client.useBucket(ali_oss.bucket)
                var resutl = yield client.put(newFilename, filepath);
                fs.unlinkSync(filepath);
                res.end(JSON.stringify({
                    status: '100',
                    msg: '上传成功'
                }))
            }).catch((err) => {
                res.send(JSON.stringify({
                    status: '101',
                    msg: '上传失败',
                    error: JSON.stringify(err)
                }))
            })
            let sql = `update goods set foodname='${foodname}',descr='${descr}',price='${price}',foodpic='${newFilename}',shoplist_id=${shoplist_id} where id=${id}`
            db.query(sql, (err, resutls, fields) => {
                if (resutls.affectedRows > 0) {
                    res.redirect('/admin/goodslist')
                } else {
                    res.redirect('/admin/goodslist')
                }
            })
        }else{
            let sql = `update goods set foodname='${foodname}',descr='${descr}',price='${price}', shoplist_id=${shoplist_id} where id=${id}`
            db.query(sql, (err, resutls, fields) => {
                console.log(resutls);
                if (resutls.affectedRows > 0) {
                    res.redirect('/admin/goodslist')
                } else {
                    res.redirect('/admin/goodslist')
                }
            })
        }
    })
})


module.exports = admingoods