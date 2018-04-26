const express =require('express');
const router =require('express-promise-router')();

const {google} = require('googleapis');
const plus = google.plus('v1');
const OAuth2 = google.auth.OAuth2;
const ClientId = "469114795742-tg31mab1uciptsvpg70oi1tbddakgf81.apps.googleusercontent.com";
const ClientSecret = "Tl_xnABeGC3nbdQCAD1Ua9cF";
const RedirectionUrl = "http://localhost:3000/users/oauthggle";

const { validateBody, schemas }=require('../helpers/routesHelpers');
const UsersControllers=require('../controllers/users');

function getOAuthClient () {
    return new OAuth2(ClientId ,  ClientSecret, RedirectionUrl);
}
 
function getAuthUrl () {
    var oauth2Client = getOAuthClient();
    // generate a url that asks permissions for Google+ and Google Calendar scopes
    var scopes = [
      'https://www.googleapis.com/auth/plus.me'
    ];
 
    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes // If you only need one scope you can pass it as string
    });
 
    return url;
}

const sessionChecker = (req, res, next) => {
    if (!req.session.user) {
       console.log("not logged");
    } else {
        next();
    }    
};
//redirrect route after google authorisation
router.get('/oauthggle',sessionChecker, function (req, res) {// you to be logged in to access this root
    var oauth2Client = getOAuthClient();
    var session = req.session;
    var code = req.query.code;
    oauth2Client.getToken(code, function(err, tokens) {
      // Now tokens contains an access_token and an optional refresh_token. Save them.
      if(!err) {
        oauth2Client.setCredentials(tokens);
        session["tokens"]=tokens;
        res.send(`
            <h3>Login successful!!</h3>
            <a href="/users/details">Go to details page</a>
        `);
      }
      else{
        res.send(`
            <h3>Login failed!!</h3>;
        `);
      }
    });
});
//extracting details from google plus
router.get("/details",sessionChecker, function (req, res) { // you to be logged in to access this root
    var oauth2Client = getOAuthClient();
    oauth2Client.setCredentials(req.session["tokens"]);
 
    var p = new Promise(function (resolve, reject) {
        plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, response) {
            resolve(response || err);
        });
    }).then(function (data) {
        res.send(`
            //<img src=${data.image.url} />;
            <h3>Hello ${data.displayName}</h3>;
        `);
    }) 
});
//route to google authorisation 
router.get("/ggledata",sessionChecker, function (req, res) {// you to be logged in to access this root
    var url = getAuthUrl();
    res.send(`
        <h1>Authentication using google oAuth</h1>;
        <a href=${url}>Login</a>;
    `)
});
router.route('/signup')
 .post(validateBody(schemas.signUpSchema),UsersControllers.signUp);

 router.get('/signUp',function(req,res){
	res.sendFile( 'C:/Users/cherutombo/loginApi/signup.html');
 });

//protected root
 router.get('/products',sessionChecker,function(req,res){//testing cookies sessionChecker,
 	//res.status(200).send();
	res.sendFile( 'C:/Users/cherutombo/loginApi/products.html');
	

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