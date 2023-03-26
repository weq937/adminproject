const crypto=require('crypto')
function getsha1(pwd){
    const sha1=crypto.createHash('sha1')
    return sha1.update(pwd).digest('hex')
}

module.exports=getsha1