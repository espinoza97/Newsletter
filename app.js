// jshint esversion:6
// const client = require("@mailchimp/mailchimp_marketing");
// const client = require("mailchimp");
const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public"));//in this case is used for css and image because they are static folders of our local code.
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
  res.sendFile(__dirname + "/signup.html");
})


app.post("/",function(req,res){
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;


  const data = {//is an object of mailchimp that store data.
    members: [//members is an array
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);//our data object should be in json format.

  const url="https://us14.api.mailchimp.com/3.0/lists/6fccb9b370/"//the endpoint url,usX is replaced by us14

  const options= {//object with key:value pair that are specified in node https modules.
    method: "POST",
    auth: "jordi1:1a4e87cf7c19b79d03e698ae97bb7bbd-us14"//auth is for authentication
  }

  const request = https.request(url,options,function(response){//is a module of node when we post to external resource,and they give us a response

    if(response.statusCode === 200){
      res.sendFile(__dirname +"/success.html");//we send the file after signing up.
    }else{
      res.sendFile(__dirname +"/failure.html");
    }

    response.on("data",function(data){//we save the request into a constant so we can use it later
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);//passing it to mailchimp server
  request.end();//specifies that we have done with that request

  console.log(firstName,lastName,email);

})


app.post("/failure",function(req,res){//if signing up is a failure the button will redirect us to home route
  res.redirect("/");
})

app.listen(process.env.PORT,function(){//is a dynamic port that heroku wil define on the go
  console.log("Server is listening on port 3000");
})


//API Key
//1a4e87cf7c19b79d03e698ae97bb7bbd-us14
//0d2929a9ed39aef41ace4b6e0928eb01

//List(Audience) ID
//6fccb9b370
