//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res){
	res.sendFile(__dirname + "/signup.html");
});


app.post("/", function(req, res){
	const firstName = req.body.fName;
	const lastName = req.body.lName;
	const mail = req.body.email;
	//console.log(firstName, lastName, mail);

	const data = {
		members: [
			{
				email_address: mail,
				status: "subscribed",
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName
				}
			}
		]
	};

	const jsonData = JSON.stringify(data);

	const url = "https://us2.api.mailchimp.com/3.0/lists/c2bd82c983";

	const options = {
		method: "POST",
		auth: "jlira:dcab393c21419d44c15e02a4e83c3c66-us2"
	}

	const request = https.request(url, options, function(response){
		if(response.statusCode === 200){
			res.sendFile(__dirname + "/sucess.html");
		} else{
			res.sendFile(__dirname + "/failure.html");
		}

		response.on("data", function(data){
			console.log(JSON.parse(data));
		})
	})

	request.write(jsonData);
	request.end();

});


//button try again on failure
app.post("/failure", function(req,res){
	res.redirect("/");
})


app.listen(process.env.PORT || 3000, function(){
	console.log("Server is running");
})


//API Key MailChimp
// dcab393c21419d44c15e02a4e83c3c66-us2

//my audience id
// c2bd82c983

//site 
// https://dry-temple-69101.herokuapp.com/