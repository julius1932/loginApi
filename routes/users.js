const express =require('express');
const router =require('express-promise-router')();
const { validateBody, schemas }=require('../helpers/routesHelpers');
const UsersControllers=require('../controllers/users');

const sessionChecker = (req, res, next) => {
    if (!req.session.user) {
       console.log("not logged");
    } else {
        next();
    }    
};
router.route('/signup')
 .post(validateBody(schemas.signUpSchema),UsersControllers.signUp);

 router.get('/signUp',function(req,res){
	res.sendFile( 'C:/Users/cherutombo/loginApi/signup.html');
 });

//protected root
 router.get('/products',sessionChecker,function(req,res){//testing cookies sessionChecker,
	//res.sendFile( 'C:/Users/cherutombo/loginApi/products.html');
	res.status(200).send("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");

 });

 router.route('/signIn')
 .post(validateBody(schemas.authSchema),UsersControllers.signIn);

  router.get('/signIn',function(req,res){
	res.sendFile( 'C:/Users/cherutombo/loginApi/signIn.html');
 });

router.get('/logout',function(req,res){
	req.session.user=null;
	res.status(200).send();
    res.redirect('/users/products');
 });

 router.route('/secret')
 .post(UsersControllers.secret);

 module.exports=router;