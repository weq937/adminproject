function checklogin(req,res,next){
    if(!req.session.uname){
        res.send(`<script>alert('请先登录');window.location.href='/admin/login'</script>`)
    }else{
        next()
    }
}

module.exports=checklogin