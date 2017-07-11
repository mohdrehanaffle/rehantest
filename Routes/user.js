var express=require('express');
var app=express();
var router=express.Router();
var body=require('body-parser');
var userservice=require('../Services/user');

app.use(body.json());
app.use(body.urlencoded({
	extended:true
}));

router.post('/signup',function(req,res){
	userservice.signup(req.body,(data)=>{
		res.send(data);
	})
})

router.post('/login',function(req,res){
	userservice.login(req.body,(data)=>{
		res.send(data);
	})
})

router.post('/delete',function(req,res){
	userservice.delete(req.body,(data)=>{
		res.send(data);
	})
})

module.exports=router;
