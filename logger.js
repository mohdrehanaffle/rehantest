var express=require('express');
var app=express();
var mongo=require('mongoose');
var schema=mongo.Schema;
var body=require('body-parser');
var mail=require('nodemailer');
var multer=require('multer');
var url='mongodb://127.0.0.1:27017/affletest';

app.use(body.json());
app.use(body.urlencoded({
	extended:false
}));

var userschema=new schema({
	name: {type: String},
	mobile: {type: Number, unique: true},
	username: {type: String, unique:true},
	password: {type: Number},
	image: {data: Buffer, type: String},
	otp: {type:Number}
},{collection:'login'})
var model=mongo.model('',userschema);

var store=multer.diskStorage({destination:function(req,file,cb){
	cb(null,'/pic')},
filename:function(req,file,cb){
	cb(null,file)}
});
var upload=multer({storage : store});

var transfar=mail.createTransport({
	host:'smtp.gmail.com',
	port:465,
	secure:true,
	auth:{
		user:'rehanrizvi355@gmail.com',
		pass:'9690102007'
	}
});

mongo.connect(url,function(err){
	if(err)
		console.log(err);
	else
		console.log("connected");
})

app.get('/register',function(req,res){
	res.sendFile(__dirname+'/register.html');
})

app.get('/signup',function(req,res){
	res.sendFile(__dirname+'/signupp.html');
})

app.get('/login',function(req,res){
	res.sendFile(__dirname+'/login.html');
})

app.post('/signup1',upload.any(),function(req,res){
	var uname=req.body.name;
	var umobile=req.body.mobile;
	var uemail=req.body.email;
	var upass=req.body.pass;
	var file=req.body.pic;
	var ootp=Math.floor(Math.random()*10000);
	var mailopts={
	    from: 'rehanrizvi355@gmail.com',
	    to: uemail,
	    text: ''+ootp
    };

    transfar.sendMail(mailopts, function(err,success){
    	if(err)
    		console.log(err);
    	else
    		console.log("mail has been send successfully");
    })

    var doc=new model({name: uname, mobile: umobile, username: uemail, password: upass, image: file, otp: ""+ootp});
    doc.save(function(err){
    	if(err)
    		res.send(err);
    	else
    		res.send("Register successfully");
    })
})

app.post('/login1',function(req,res){
	var nemail=req.body.email;
	var npass=req.body.pass;
	var notp=req.body.otp;
	model.find({"username":nemail, "password":npass, "otp":notp},function(err,data){
		if(err)
			res.send(err);
		if(data.length==0)
			res.send("Either email or password or otp is incorrect");
		else
			res.send("successfully login");
	})

	app.get('/delete',function(req,res){
		model.remove({"username":nemail},function(err){
			if(err)
				res.send(err);
			else
				res.send("Account remove successfully");
		})
	})
})

app.listen(8080)
