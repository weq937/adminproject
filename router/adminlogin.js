const express=require('express')
const adminlogin=express.Router()
const getsha1=require('../utils/getsha1')
const bodyParser=require('body-parser')
const db=require('../utils/db')
const session =require('express-session')
adminlogin.use(session({
	secret: 'keyboard cat',//参与加密的字符串（又称签名）
	saveUninitialized: false, //是否为每次请求都设置一个cookie用来存储session的id
	resave: true ,//是否在每次请求时重新保存session      把session信息存储在cookie
	cookie:{maxAge: 86400000}//session的过期时间,单位为毫秒 
}))
adminlogin.use(bodyParser.urlencoded({
    extended: false
}));
adminlogin.use(bodyParser.json());

adminlogin.get('/login',(req,res)=>{
    res.render('Adminlogin/adminlogin',{title:'登录界面'})
})
adminlogin.post('/dologin',(req,res)=>{
    let {uname,pwd}=req.body
    pwd=getsha1(pwd)
    let sql=`select * from admin_users where uname='${uname}'`
    db.query(sql,(err,results,fields)=>{
        if(results.length<=0){
            res.send(`<script>alert("用户名错误");window.location.href="/admin/login"</script>`)
        }
        else{
            if(pwd!==results[0].pwd){
                res.send(`<script>alert("密码错误");window.location.href="/admin/login"</script>`)
            }else{
                req.session.uname=uname
                res.send(`<script>alert("登录成功");window.location.href="/admin/index"</script>`)
            }
        }
    })
    
})
adminlogin.get('/logout',(req,res)=>{
    req.session.uname=''
    res.redirect('/admin/login')
})
module.exports=adminlogin