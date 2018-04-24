const express =require('express');
const router =require('express-promise-router')();
const { validateBody, schemas }=require('../helpers/routesHelpers');
const UsersControllers=require('../controllers/users');

const sessionChecker = (req, res, next) => {
	console.log( "in sessionChecker");
	console.log(req.session);
    if (!req.session.user) {
       console.log("not logged");
    } else {
        next();
    }    
};
router.route('/signup')
 .post(validateBody(schemas.signUpSchema),UsersControllers.signUp);

 router.get('/signup',function(req,res){//testing cookies sessionChecker,
    //console.log(req.session['user_sid']);
	console.log("============================================");
	console.log(req.session.user);
	console.log("============================================");
	res.sendFile( 'C:/Users/cherutombo/loginApi/signup.html');
 });

 router.get('/products',sessionChecker,function(req,res){//testing cookies ,
    //console.log(req.session['user_sid']);
	console.log("============================================");
	console.log(req.session.user);
	console.log("============================================");
	res.sendFile( 'C:/Users/cherutombo/loginApi/products.html');
 });
 router.route('/signin')
 .post(validateBody(schemas.authSchema),UsersControllers.signIn);

 router.route('/secret')
 .post(UsersControllers.secret);

 module.exports=router;