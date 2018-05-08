var express    = require("express");
var login = require('./routes/loginroutes');
var bodyParser = require('body-parser');
var app = express();
 var mysql      = require('mysql');
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var router = express.Router();
// test route
router.get('/', function(req, res) {
    res.json({ message: 'welcome to our qrios customer apis' });
});
router.get('/verifyemailget', function(req, res) {
    connection.query('SELECT * FROM qrioscustomer WHERE email = ?',[req.query.email], function (error, results, fields) {
    if(error){
      res.json({
      "code":401,
      "message":"Technical error"
    })
    }else{
      if(results.length > 0){
        res.json({
        "code":402,
        "status":1,
        "message":"Email Found"
        })
      }else{
        res.json({
        "code":401,
        "status":0,
        "message":"Email not registered"
        })
      }
    }
  });
});

//route to handle user registration
router.post('/register',login.register);
router.post('/verifyemailpost',login.verifyemailpost);
app.use('/api', router);
app.listen(5000);
