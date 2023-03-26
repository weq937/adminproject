const express=require('express')
const app=express()
const adminuser=require('./router/adminuser')
const adminlogin=require('./router/adminlogin')
const homeuser=require('./router/homeuser')
const adminshop=require('./router/adminshop')
const admingoods=require('./router/admingoods')
const adminorders=require('./router/adminorders')
const adminindex=require('./router/adminindex')
const api = require('./router/api')

app.use(express.static('node_modules'))
app.use(express.static('public'))
app.use(express.static('uploads'))

app.set('view engine', 'pug')
app.set('views','./views')


app.use('/admin',adminuser)
app.use('/admin',adminlogin)
app.use('/admin',homeuser)
app.use('/admin',adminshop)
app.use('/admin',admingoods)
app.use('/admin',adminorders)
app.use('/admin',adminindex)
app.use('/admin',api) // 后台api模块 用于和前端对接 


app.listen(8887,()=>{
    console.log('蔡徐坤');
})