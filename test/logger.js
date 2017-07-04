var express=require('express');
var app=express();
var mongo=require('mongoose');
var schema=mongo.Schema;
var body=require('body-parser');
var mail=require('nodemailer');
var multer=require('multer');
var fs=require('fs');
var url='mongodb://127.0.0.1:27017/affletest';

app.use(body.json());
app.use(body.urlencoded({
	extended:false
}));

var counter;
var userschema=new schema({
	name: {type: String},
	mobile: {type: Number, unique: true},
	username: {type: String, unique:true},
	password: {type: Number},
	image: {data: Buffer, contentType: String},
	otp: {type: Number},
    count: {type: Number}
},{collection:'login'})
var model=mongo.model('',userschema);

var store=multer.diskStorage({destination:function(req,file,cb){
	cb(null,__dirname+'/pic/')},
filename:function(req,file,cb){
	cb(null,file.originalname)}
});
var upload=multer({storage: store});

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

app.get('/forget',function(req,res){
	res.sendFile(__dirname+'/forget.html');
})

app.use('/login1',express.static(__dirname+'/pic'));

app.post('/signup1',upload.any(),function(req,res){
	counter=1;
	var uname=req.body.name;
	var umobile=req.body.mobile;
	var uemail=req.body.email;
	var upass=req.body.pass;
	var file=req.files;
	var imgpath=file[0].path;
	var ootp=Math.floor(1000+Math.random()*10000);
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

    var doc=new model({name: uname, mobile: umobile, username: uemail, password: upass, otp: ootp,count: counter});
    doc.image.data=fs.readFileSync(imgpath);
    doc.save(function(err){
    	if(err)
    		res.send(err);
    	else{
    			res.send("Register successfully");
    			fs.appendFile('detail.txt',"\nRegister successfully",function(err){
    				if(err)
    					console.log(err);
    				else
    					console.log("data has been written");
    			})
    	}
    })
})

app.post('/login1',function(req,res){
	var nemail=req.body.email;
	var npass=req.body.pass;
	model.find({"username":nemail, "password":npass},function(err,doc){
		if(err)
			res.send(err);
		if(doc.length==0)
			res.send("Either email or password is incorrect");
		else
			{
				var response=" Your name is "+doc[0].name+"\n Your mobile number is "+doc[0].mobile+
					    		"\n Your Email is "+doc[0].username+"\n Your Image is "+doc[0].image.data;
				var count1=doc[0].count;
				if(count1==1){
					res.sendFile(__dirname+'/otp.html');
					counter=2;
					model.update({"username":nemail},{$set:{"count": counter}},function(err){
					    if(err)
						    console.log(err)
					    else
						    console.log("updated successfully");
				    })


					app.get('/login2',function(req,res){
					    var notp=req.body.otp;
					    model.find({"username":nemail, "password":npass, "otp":notp},function(err,doc){
					    	if(err)
					    		res.send(err);
					    	if(doc.length==0)
					    		res.send("Enter the correct otp");
					    	else
					    		res.send(doc);					    	
					    })
					})
				}
				else{
				    res.send(doc);
				
				    
				    fs.appendFile('detail.txt',"\nLogin successfully",function(err){
    				    if(err)
    					    console.log(err);
    				    else
    					    console.log("data has been written");
    			    })

				}
			}
	})

	app.get('/delete1',function(req,res){
		model.remove({"username":nemail},function(err){
			if(err)
				res.send(err);
			else
				res.send("Account remove successfully");
			    fs.appendFile('detail.txt',"\nDeleted successfully",function(err){
    				if(err)
    					console.log(err);
    				else
    					console.log("data has been written");
    			})

		})
	})

	app.get('/reset',function(req,res){
		res.sendFile(__dirname+'/reset.html');
	})

	app.post('/reset1',function(req,res){
		var opass=req.body.opass;
		var npass=req.body.npass;
		model.findOne({"username":nemail},function(err,doc1){
			if(err)
				res.send(err);
			else{
				if(doc1.password==opass){
					model.update({"username":nemail},{$set:{"password":npass}},function(err){
						if(err)
							res.send(err);
						else
							res.send("Password Reset successfully");
					})
				}
				else
					res.send("Enter the correct Password");
			}
		})
	})
})

app.get('/forget1',function(req,res){
	var email=req.query.email;
	var ootp=Math.floor(1000+Math.random()*10000);
	model.findOne({"username":email},function(err,doc1){
		if(err)
			res.send(err);
		if(doc1==null)
			res.send("Enter the correct email");
		else{
	        var mailopts={
	            from: 'rehanrizvi355@gmail.com',
	            to: 'mohd.rehan@affle.com',
	            text: ''+ootp
            };
            transfar.sendMail(mailopts,function(err){
            	if(err)
            		res.send(err);
            	else
            		console.log("A mail has been sent to Your register email with an otp");
            })
            res.sendFile(__dirname+'/forget1.html');
		}
	})

	app.get('/forget2',function(req,res){
		var notp=req.query.otp;
		if(ootp==notp)
			res.sendFile(__dirname+'/forget2.html');
		else
			res.send("Enter the correct OTP");
	})

	app.post('/forget3',function(req,res){
		var npass=req.body.npass;
		var rpass=req.body.cpass;
		if(npass==rpass){
			model.update({"username":email},{$set:{"password":npass}},function(err){
				if(err)
					res.send(err);
				else
					res.send("Password successfully changed");
			})
		}
		else
			res.send("Both Password should be same");
	})
})

app.listen(8080);