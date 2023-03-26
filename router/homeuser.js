const express=require('express')
const homeuser=express.Router()
const db=require('../utils/db')
const checklogin=require('../utils/cheklogin')

homeuser.get('/homeuserlist',(req,res)=>{
    let sql=`select * from users order by id desc `
    db.query(sql,(err,data,fields)=>{
        res.render('Homeuser/homeuserlist',{title:'会员列表',data:data,uname:req.session.uname})
    })
})

homeuser.get('/homeusersearch',checklogin,(req,res)=>{
    let {keywords}=req.query
    let sql=`select * from users where username like "%${keywords}%"`
    db.query(sql,(err,data,fields)=>{
        res.render('Homeuser/homeuserlist',{title:'会员列表',data:data,uname:req.session.uname})
    })
})

homeuser.get('/homeuserinfo',checklogin,(req,res)=>{
    let{username}=req.query
    let sql=`select * from user_info where userinfo_name='${username}' `
    db.query(sql,(err,data,fields)=>{
        console.log(err);
        console.log(data);
        res.render('Homeuser/homeuserinfo',{title:'会员详细信息',data:data[0],uname:req.session.uname})
    })
})
homeuser.get('/homeuseraddress',checklogin,(req,res)=>{
    let{uname}=req.query
    let sql=`select * from address where username ="${uname}"`
    db.query(sql,(err,data,fields)=>{
        res.render('Homeuser/homeuseraddress',{title:'会员收货地址',data:data,uname:req.session.uname})
    })
})





module.exports=homeuser