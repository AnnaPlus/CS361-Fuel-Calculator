const express = require('express');
const request = require('request')
var CORS = require('cors')

let API_Key = '23afcae2af504bf3843cfe066a50965f'

var app = express();
app.set('port', 5151);
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(CORS());

// Route to receive Get HTTP request from client.
app.get('/',function(req,resp,next){
  if (req.query.id){
    let recipeId = req.query.id
    let calorieAmount = {'calories': null}

    // requests API Spoonacular for recipe calorie amount according to recipe ID
    request('https://api.spoonacular.com/recipes/' + recipeId + '/nutritionWidget.json?apiKey=' + API_Key, { json: true }, (err, res, body) => {
      if (err) { return console.log(err); }
        calorieAmount['calories'] = body.calories
        results = JSON.stringify(calorieAmount)
        resp.send(results)  // return results back to the client. 
    });
  }
});

// error handling routes
app.use(function(req,res){
  res.status(404);
  res.send('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.send('500');
});

// server connection message
app.listen(app.get('port'), function(){
  console.log(`Express started on http://${process.env.HOSTNAME}:${app.get('port')}; press Ctrl-C to terminate.`);
});