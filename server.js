const express=require('express');
const bodyParser=require('body-parser');
const morgan=require('morgan');
const async=require('async');
const request=require('request'); 
const expressHbs=require('express-handlebars');
const session=require('express-session');
const MongoStore=require('connect-mongo')(session);
const flash=require('express-flash');

const app=express();

//mongodb://<dbuser>:<dbpassword>@ds117070.mlab.com:17070/abhinewsletter
app.engine('.hbs',expressHbs({defaultLayout:'layout',extname:'.hbs'}));

app.set('view engine','hbs');

app.use(express.static(__dirname+'/public'));


// app.use(bodyParser.json()) basically tells the system that you want json to be used.

// bodyParser.urlencoded({extended: ...}) basically tells the system whether you 
// want to use a simple algorithm for shallow parsing (i.e. false)
// or complex algorithm for deep parsing that can deal with nested objects (i.e. true).


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

//This tells express to log  user requests via morgan
//and morgan to log in the "dev" pre-defined format
app.use(morgan('dev'))

app.use(session({

	resave:true,
	saveUinitialized:true,
	secret:"thisissecretkey",
	store:new MongoStore({url :"mongodb://root:abhijit007@ds117070.mlab.com:17070/abhinewsletter"})
}));

app.use(flash());


//https://us17.api.mailchimp.com/3.0/lists/306c2ea01a/members
//0effa7fb34dea50edbf0bb4190ce08e9-us17

// app.get('/',(req,res,next)=>{

//    res.render('main/home');
// });

app.route('/')
	.get((req,res,next)=>{
		res.render('main/home',{message:req.flash('success')});

	})
	.post((req,res,next)=>{

		request({
			url:'https://us17.api.mailchimp.com/3.0/lists/306c2ea01a/members',
			method:'POST',
			headers:{
				'Authorization':'randomUser 0effa7fb34dea50edbf0bb4190ce08e9-us17',
				'Content-type':'application/json'
			},
			json:{

				'email_address':req.body.email,
				'status':'subscribed'
			}


		},function(err,response,body){
			if(err){
				console.log(err); 
			}
			else{
				req.flash('success','You have submitted the email');
				res.redirect('/');
			}
		})

	})

//assign a port to run our app

app.listen(3030,(err)=>{
	if(err){

		console.log(err);
	}
	else{
console.log("Running on port 3030");

	}

})
