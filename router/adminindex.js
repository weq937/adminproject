const express = require('express')
const adminindex = express.Router()
const db = require('../utils/db')
const checklogin = require('../utils/cheklogin')

adminindex.get('/index', checklogin, (req, res) => {
    let data = []
    let sql = `select count(*) as admin_user_num from admin_users`
    db.query(sql, (err, resutls, fields) => {
        data.push(resutls[0].admin_user_num)
        let sql = `select count(*) as shop_num from shoplists`
        db.query(sql, (err, resutls, fields) => {
            data.push(resutls[0].shop_num)
            let sql = `select count(*) as users_num from users`
            db.query(sql, (err, resutls, fields) => {
                data.push(resutls[0].users_num)
                let sql = `select count(*) as goods_num from goods`
                db.query(sql, (err, resutls, fields) => {
                    data.push(resutls[0].goods_num)
                    let sql = `select count(*) as orders_goods_num from orders_goods`
                    db.query(sql, (err, resutls, fields) => {
                        data.push(resutls[0].orders_goods_num)
                        let sql = `select count(*) as comments_num from comments`
                        db.query(sql, (err, resutls, fields) => {
                            data.push(resutls[0].comments_num)
                            res.render('Adminindex/adminindex', {
                                title: '后台首页',
                                uname: req.session.uname,
                                data
                            })
                        })
                    })

                })
            })

        })
    })

})

module.exports = adminindex