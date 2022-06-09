//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require('lodash');
const https = require('https');
const request = require('request');

const homeStartingContent = "";
const aboutContent = '';
const contactContent = '';

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


let posts = [];


app.get('/', (req, res) => {
  res.render('home', { startingContent: homeStartingContent, posts: posts });
});

app.get('/about', (req, res) => {
  res.render('about', { aboutContent: aboutContent });
});

app.get('/contact', (req, res) => {
  res.render('contact', { contactContent: contactContent });
});


app.get('/posts/:postName', (req, res) => {
  const requestedTitle = lodash.lowerCase(req.params.postName);

  posts.forEach((Element) => {
    if (requestedTitle == lodash.lowerCase(Element.title)) {

      res.render('post', {
        postTitle: Element.title, postBody: Element.content
      });
    }

  });



});

app.get('/compose', (req, res) => {
  res.render('compose');
});




app.post('/compose', (req, res) => {

  const post = {
    title: req.body.postTitle,
    content: req.body.postBody

  };
  posts.push(post);
  res.redirect('/');

});

//Adding Extra Content to make things Complex -_-

app.post('/contact', (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const ListId = "7999aeedcf";
  const url = "https://us10.api.mailchimp.com/3.0/lists/" + ListId;
  const apikey = "Enter_Your_API_KEY_here";
  const options = {
    method: 'POST',
    auth: "john:" + apikey
  }
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  const request = https.request(url, options, (response) => {
    res.redirect('/');

  })

  request.write(jsonData);
  request.end();

});










app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
