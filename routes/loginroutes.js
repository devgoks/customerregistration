var express    = require("express");
 var mysql      = require('mysql');
 var nodemailer = require('nodemailer');
 var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : '',
   database : 'plsm'
 });
 connection.connect(function(err){
 if(!err) {
     console.log("Database is connected ... \n\n");  
 } else {
     console.log("Error connecting database ... \n\n");  
 }
 });

exports.register = function(req,res){
  var today = new Date();
  var invalidinput='';
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(re.test(req.body.email) == false){
    res.send({
      "code":400,
      "message":"Invalid Email supplied"
    })
  }else{
  connection.query('SELECT * FROM qrioscustomer WHERE email = ?',[req.body.email], function (error, results, fields) {
    if(error){
      res.send({
      "code":401,
      "message":"Technical error"
    })
    }else{
      if(results.length > 0){
        res.send({
        "code":402,
        "message":"Email address already in use"
        })
      }else{
          var users={
          "surname":req.body.surname,
          "firstname":req.body.firstname,
          "phone":req.body.phone,
          "email":req.body.email,
          "date":today,
        }
        connection.query('INSERT INTO qrioscustomer SET ?',users, function (error, results, fields) {
        if (error) {
          res.send({
            "code":403,
            "message":"error ocurred"
          })
        }else{
          console.log('The solution is: ', results);
          res.send({
            "code":200,
            "message":"Thanks for registering with Qrios Networks..... "+req.body.surname+" "+req.body.firstname
              });
        }
        });
      }
    }

  });
  }
}
exports.verifyemailpost = function(req,res){
  connection.query('SELECT * FROM qrioscustomer WHERE email = ?',[req.body.email], function (error, results, fields) {
    if(error){
      res.send({
      "code":401,
      "message":"Technical error"
    })
    }else{
      if(results.length > 0){
        res.send({
        "code":402,
        "status":1,
        "message":"Email Found"
        })
      }else{
        res.send({
        "code":401,
        "status":0,
        "message":"Email not registered"
        })
      }
    }
  });
}


