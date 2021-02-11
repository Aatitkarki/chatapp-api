var dboperation = require('./dboperation');
var Order = require('./user');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());
app.use('/api',router);

var port = process.env.PORT || 5000;
app.listen(port);
console.log("The app is running at port "+port)

router.use((request,response,next)=>{
    console.log("middleware activated");
    next();
})

router.route('/users').get((req,res)=>{
    dboperation.getUsers().then(result=>{
       res.json(result[0]);
        // console.log(result);
    });
});
router.route('/signup').post((req,res)=>{
    console.log(req.body);
    res.json({"message":"Success"});

});



