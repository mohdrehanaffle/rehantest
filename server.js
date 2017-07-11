var express=require('express');
var app=express();
var userroute=require('./Routes/user');
var body=require('body-parser');

app.use(body.json());
app.use(body.urlencoded({
	extended: false
}));

app.use('/user',userroute);

app.listen(3000,function(err){
	console.log("App in running condition");
});
