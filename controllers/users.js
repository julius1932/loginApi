const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const url = "mongodb://localhost:27017/";
var dbo="";
MongoClient.connect(url, function(err, db) {
  if (err) {isfound=false; return;};
  dbo = db.db("mydb");
  });
hashPass=function(pass){
    return bcrypt.hash(pass,8);
}
isPasswordCorrect=function(plainPass,hashedPass){
 if(bcrypt.compare(plainPass, hashedPass)){
 	return true;
 }
 return false;
}
module.exports={
	signUp: async (req, res, next)=>{
		//email, password,phone
		console.log('contents of req.value.body',req.value.body);
		console.log("UsersComtroller.signUp called");
		var pass= await hashPass(req.value.body.password);
		var item = req.value.body;
		item.password=pass;
		var query = { email : req.value.body.email };
		await dbo.collection("users").find(query).toArray(function(err, result) {
        if (err) {
            res.redirect('/users/signUp');
        	return;
        }else{ 
            if(result.length>=1){
        	    console.log("email already registered");
        	    res.redirect('/users/signUp');
                return;
            }
            return dbo.collection("users").insertOne(item, function(err, res) {
                if (err) {
                	 res.redirect('/users/signUp');
                	return;
                };
                req.session.user = query;
                console.log("1 document inserted");
                res.status(200).send();
                res.redirect('/users/products');
                return;
           });
        }
      });
	},
	signIn: async(req, res, next)=>{
		var query = { email : req.value.body.email };
	    await dbo.collection("users").find(query).toArray(function(err, result) {
        if (err) {
        	res.redirect('/users/signIn');
        	return;
        }else{ 
            if(result.length>=1){
            	hashedPass=result[0].password;
            	bcrypt.compare(req.value.body.password, hashedPass, function(err, ress) {
                     if(ress) {
                        // Passwords match
                        req.session.user =req.value.body.email;
                        res.status(200).send();
                        res.redirect('/users/products');
                     } else {
                        // Passwords don't match
                        console.log("wrong username or password");
                        res.redirect('/users/signIn');
                    } 
                });
                return;
            }else{
                console.log("wrong username or password 2");
                res.redirect('/users/signIn');
            }
        }
  });

		
	},
	secret: async(req, res, next)=>{
		console.log("UsersComtroller.secret called");
	}
}