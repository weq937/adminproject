const express = require('express')
const adminuser = express.Router()
const db = require('../utils/db')
const checklogin=require('../utils/cheklogin')

const session=require('../utils/setsession')
adminuser.use(session)
const bodyParser = require('body-parser')
const getsha1 = require('../utils/getsha1')
adminuser.use(bodyParser.urlencoded({
    extended: false
}));
adminuser.use(bodyParser.json());
adminuser.get('/useradd', checklogin,(req, res) => {
    res.render('AdminUser/adminuseradd', {
        title: '管理员添加页面',
        uname:req.session.uname
    })
})
adminuser.get('/userlist',checklogin, (req, res) => {
    let sql = `select * from admin_users order by id desc`
    db.query(sql, (err,data, fields) => {     
        res.render('AdminUser/adminuserlist', {
            title: '管理员展示页面',
            data: data,
            uname:req.session.uname
        })
    })

})

adminuser.post('/userdoadd',checklogin, (req, res) => {
    let {
        uname,
        pwd
    } = req.body
    pwd = getsha1(pwd)
    console.log(pwd);
    let sql = `insert into admin_users(uname,pwd) values('${uname}','${pwd}')`
    db.query(sql, (err, results, fields) => {
        console.log(results);
        if (results.affectedRows > 0) {
            res.redirect('/admin/userlist')
        } else {
            res.redirect('/admin/useradd')
        }
    })
})

adminuser.get('/userdel',checklogin, (req, res) => {
    let {
        id
    } = req.query
    let sql = `delete from admin_users where id=${id}`
    db.query(sql, (err, results, fields) => {
        if (results.affectedRows > 0) {
            res.send(`<script>alert("删除成功");window.location.href="/admin/userlist"</script>`)
        } else {
            res.send(`<script>alert("删除失败");window.location.href="/admin/userlist"</script>`)
        }
    })
})
//更新操作

adminuser.get('/userupdate',checklogin, (req, res) => {
    let {
        id
    } = req.query

    let sql = `select * from admin_users where id=${id}`
    db.query(sql,(err,results,fields)=>{
        let [data]=results
        res.render('AdminUser/adminuserupdate',{title:'更新页面',data:data,uname:req.session.uname})
    })
})
adminuser.post('/userdoupdate',checklogin,(req,res)=>{
    let {id,uname,pwd}=req.body
    pwd = getsha1(pwd)
    let sql=`update admin_users set uname='${uname}',pwd='${pwd}' where id=${id}`
    db.query(sql,(err,results,fields)=>{
        if(results.affectedRows>0){
            res.send(`<script>alert("更新成功");window.location.href="/admin/userlist"</script>`)
        }else{
            res.send(`<script>alert("更新失败");window.location.href="/admin/userlist"</script>`)
        }
    })
})


module.exports = adminuser