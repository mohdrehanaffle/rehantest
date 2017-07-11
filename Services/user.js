var mongo=require('mongoose');
var schema=mongo.Schema;
var mail=require('nodemailer');
var url='mongodb://127.0.0.1:27017/project'

var userschema=new schema({
	name :{type: String},
	email: {type: String, unique: true},
	pass: {type: Number},
	phone: {type: Number},
	photo: {type :String}
},{collection: 'user'});
var model=mongo.model('',userschema);

var transfar=mail.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: 'rehanrizvi355@gmail.com',
		pass: '9690102007'
	}
});

mongo.connect(url,function(err){
	if(err)
		console.log(err);
	else
		console.log("connected");
})

var signup=(body,callback)=>{
	var name=body.name;
	var email=body.email;
	var pass=body.pass;
	var phone=body.phone;
	var file=req.files;
	var pic=data.pic;
	var mailopts={
		'from': 'rehanrizvi355@gmail.com',
		'to': email,
		'text': 'Your account is created successfully' 
	};

	transfar.sendMail(mailopts, function(err){
		if(err)
			console.log(err);
		else
			console.log("message send successfully");
	})

	var doc=new model({"name": name, "email": email, "pass": pass, "phone": phone, "photo": pic});
	doc.save(function(err){
		if(err)
			callback(err);
		else{
			callback("signup successfully");
		}
	})	
}

var login=(body,callback)=>{
	var email=body.email;
	var pass=body.pass;

	model.find({"email": email, "pass": pass},function(err,data){
		if(err)
			callback(err);
		if(data.length==0)
			callback("invalid user");
		else
		{
			callback(data);
		}
	})
}

var del=(body,callback)=>{
	var email=body.email;

	model.remove({"email": email},function(err){
		if(err)
			callback(err);
		else{
				callback("account deleted successfully");
		}
	})
}

module.exports={
	login: login,
	signup: signup,
	delete: del
};