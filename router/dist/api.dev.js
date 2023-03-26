"use strict";

var express = require('express');

var bodyParser = require('body-parser'); //引入cookie-parser


var cookieParser = require("cookie-parser");

var getsha1 = require('../utils/getsha1');

var db = require('../utils/db');

var api = express.Router(); //使用cookie-parer

api.use(cookieParser()); //开放vue前端接口
//开放给vue项目商家列表数据json格式接口

api.get("/shoplists", function (req, res) {
  // console.log('1111');
  // res.end();
  db.query('select * from shoplists', function (error, results, fields) {
    if (error) throw error; //设置字符集

    res.setHeader('content-type', 'text/html;charset=utf-8');
    res.write(JSON.stringify(results));
    res.end();
  });
}); //用户模块 登录注册开放接口（路由一定是唯一）
//注册

api.get("/registeruser", function (req, res) {
  //获取表单的提交数据
  var name = req.query.name;
  var pass1 = req.query.pass;
  var newpassword = getsha1(pass1); //数据的入库
  //mysql预处理
  //准备sql语句

  var sql = "insert into users(username,pass)values('" + name + "','" + newpassword + "')"; //执行

  db.query(sql, function (error, results, fields) {
    // console.log(results);
    //判断
    if (results.affectedRows > 0) {
      //设置cookie  把注册得名字写入到cookie中
      res.cookie('name', name, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
      });
      res.write(JSON.stringify({
        'msg': 'ok',
        'name': req.cookies.name
      }));
      res.end();
    } else {
      // res.redirect("/add");
      res.write(JSON.stringify({
        'msg': 'error'
      }));
      res.end();
    }
  }); // });
}); //执行登录接口

api.post("/loginuser", function (req, res) {
  //获取name和pass
  var name = req.body.name;
  var pass = req.body.pass; // console.log(name,pass)
  //把name和pass做对比=》stu数据表做对比
  //对比name和数据库name

  db.query('select * from users where username="' + name + '"', function (error, results, fields) {
    // console.log(results);
    if (results.length <= 0) {
      //用户名有误
      res.write(JSON.stringify({
        'msg': 'usernameiserror'
      }));
      res.end();
    } else {
      //用户名ok 检测密码
      var newpassword = getsha1(pass);

      if (newpassword == results[0].pass) {
        res.cookie('name', name, {
          maxAge: 1000 * 60 * 60 * 24,
          httpOnly: true
        });
        res.write(JSON.stringify({
          'msg': 'ok',
          'name': req.cookies.name
        }));
        res.end();
      } else {
        res.write(JSON.stringify({
          'msg': 'userpassiserror'
        }));
        res.end();
      }
    }
  });
}); //获取cookie中用户的名字

api.get('/userinfos', function (req, res) {
  if (!req.cookies.name) {
    res.write(JSON.stringify({
      'msg1': 'no login'
    }));
    res.end();
  } else {
    res.write(JSON.stringify({
      'msg': req.cookies.name
    }));
    res.end();
  }
}); //退出接口

api.get("/vuelogout", function (req, res) {
  //cookie清除
  res.clearCookie('name');
  res.write(JSON.stringify({
    'msg': 0
  }));
  res.end();
}); //获取单个商家的信息接口

api.get("/shoplistone", function (req, res) {
  var id = req.query.id; //获取单个shoplists表数据

  db.query("select * from shoplists where id=" + id, function (error, results, fields) {
    res.setHeader('content-type', 'text/html;charset=utf-8');
    res.write(JSON.stringify(results[0]));
    res.end();
  });
}); //获取单个商家食品列表接口
//id就是商家的id

api.get("/vueshopgoods", function (req, res) {
  var id = req.query.id;
  db.query("select * from goods where shoplist_id=" + id, function (error, results, fields) {
    res.setHeader('content-type', 'text/html;charset=utf-8');
    res.write(JSON.stringify(results));
    res.end();
  });
}); //商家评价列表接口

api.get("/vuecomments", function (req, res) {
  var id = req.query.id;
  db.query("select * from comments where shoplist_id=" + id, function (error, results, fields) {
    res.setHeader('content-type', 'text/html;charset=utf-8');
    res.write(JSON.stringify(results));
    res.end();
  });
}); //添加收货地址

api.post("/addaddress", function (req, res) {
  var name = req.body.name;
  var phone = req.body.phone;
  var address = req.body.address;
  var username = req.body.username;
  var sql = "insert into address(realname,phone,address,username)values('" + name + "','" + phone + "','" + address + "','" + username + "')";
  db.query(sql, function (error, results, fields) {
    // console.log(results);
    if (results.affectedRows > 0) {
      res.write(JSON.stringify({
        'msg': 'ok'
      }));
      res.end();
    } else {
      res.write(JSON.stringify({
        'msg': 'error'
      }));
      res.end();
    }
  });
}); //获取用户收货地址

api.get("/usersaddress", function (req, res) {
  var username = req.query.username; //获取stu表数据

  db.query("select * from address where username='" + username + "'", function (error, results, fields) {
    res.setHeader('content-type', 'text/html;charset=utf-8');
    res.write(JSON.stringify(results));
    res.end();
  });
}); //生成订单接口

api.post("/addorder", function (req, res) {
  var order_num = req.body.order_num;
  var address_id = req.body.address_id;
  var food_totalprice = req.body.food_totalprice;
  var username = req.body.username;
  var sql = "insert into orders(order_num,address_id,food_totalprice,username)values('" + order_num + "','" + address_id + "','" + food_totalprice + "','" + username + "')";
  console.log(sql);
  db.query(sql, function (error, results, fields) {
    console.log(results);

    if (results.affectedRows > 0) {
      res.write(JSON.stringify({
        'msg': 'ok',
        'insertid': results.insertId
      }));
      res.end();
    } else {
      res.write(JSON.stringify({
        'msg': 'error'
      }));
      res.end();
    }
  });
}); //获取登录用户的订单数据接口

api.get("/userorders", function (req, res) {
  var username = req.query.username; //获取stu表数据

  db.query("select * from orders where username='" + username + "'", function (error, results, fields) {
    res.setHeader('content-type', 'text/html;charset=utf-8');
    res.write(JSON.stringify(results));
    res.end();
  });
}); //生成订单详情接口

api.post("/addordergoods", function (req, res) {
  var foodname = req.body.foodname;
  var pic = req.body.pic;
  var count = req.body.count;
  var orders_id = req.body.orders_id;
  var sql = "insert into orders_goods(foodname,pic,count,orders_id)values('" + foodname + "','" + pic + "','" + count + "','" + orders_id + "')";
  db.query(sql, function (error, results, fields) {
    // console.log(results);
    if (results.affectedRows > 0) {
      res.write(JSON.stringify({
        'msg': 'ok',
        'insertid': results.insertId
      }));
      res.end();
    } else {
      res.write(JSON.stringify({
        'msg': 'error'
      }));
      res.end();
    }
  });
}); //获取订单的详情数据接口

api.get("/orderinfos", function (req, res) {
  var orders_id = req.query.orders_id; //获取stu表数据

  db.query("select * from orders_goods where orders_id=" + orders_id, function (error, results, fields) {
    res.setHeader('content-type', 'text/html;charset=utf-8');
    res.write(JSON.stringify(results));
    res.end();
  });
}); //获取用户详情信息接口

api.get("/usermessage", function (req, res) {
  var name = req.query.name; //获取单个shoplists表数据

  db.query("select * from user_info where userinfo_name='" + name + "'", function (error, results, fields) {
    if (results.length == 0) {
      res.setHeader('content-type', 'text/html;charset=utf-8');
      res.write(JSON.stringify({
        "realname": ""
      }));
      res.end();
    } else {
      res.setHeader('content-type', 'text/html;charset=utf-8');
      res.write(JSON.stringify(results[0]));
      res.end();
    }
  });
}); //插入会员详情接口

api.post("/insertuserinfo", function (req, res) {
  var username = req.body.username;
  var phone = req.body.phone;
  var email = req.body.email;
  var userinfo_name = req.body.userinfo_name; // console.log(username,phone,email,hobby,userinfo_name)

  var sql = "insert into user_info(realname,phone,email,userinfo_name)values('" + username + "','" + phone + "','" + email + "','" + userinfo_name + "')";
  console.log(sql);
  db.query(sql, function (error, results, fields) {
    // console.log(results);
    if (results.affectedRows > 0) {
      res.write(JSON.stringify({
        'msg': 'ok',
        'insertid': results.insertId
      }));
      res.end();
    } else {
      res.write(JSON.stringify({
        'msg': 'error'
      }));
      res.end();
    }
  });
}); //修改用户详情接口

api.post("/updateuserinfo", function (req, res) {
  var username = req.body.username;
  var phone = req.body.phone;
  var email = req.body.email;
  var userinfo_name = req.body.userinfo_name;
  var sql = "update user_info set realname='" + username + "',phone='" + phone + "',email='" + email + "'where userinfo_name='" + userinfo_name + "'";
  db.query(sql, function (error, results, fields) {
    // console.log(results);
    if (results.affectedRows > 0) {
      res.write(JSON.stringify({
        'msg': 'ok'
      }));
      res.end();
    } else {
      res.write(JSON.stringify({
        'msg': 'error'
      }));
      res.end();
    }
  });
}); //修改用户头像详情接口

api.post("/updateuserpic", function (req, res) {
  var headerpic = req.body.headerpic;
  var userinfo_name = req.body.userinfo_name;
  var sql = "update user_info set pic='" + headerpic + "' where userinfo_name='" + userinfo_name + "'"; // console.log(sql)

  db.query(sql, function (error, results, fields) {
    // console.log(results);
    if (results.affectedRows > 0) {
      res.write(JSON.stringify({
        'msg': 'ok'
      }));
      res.end();
    } else {
      res.write(JSON.stringify({
        'msg': 'error'
      }));
      res.end();
    }
  });
});
api.get("/search", function (req, res) {
  var limt = req.query.limt;
  console.log(limt);
  var sql = "select * from shoplists where shopname like '%".concat(limt, "%'"); // console.log(sql)

  db.query(sql, function (error, results, fields) {
    console.log(results);

    if (results.affectedRows > 0) {
      res.write(JSON.stringify({
        'msg': 'ok'
      }));
      res.end();
    } else {
      res.write(JSON.stringify({
        'msg': 'error'
      }));
      res.end();
    }
  });
}); // 暴露接口

module.exports = api;