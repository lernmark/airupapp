// Copyright 2015-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';
var format = require('util').format;
var express = require('express');
var gcloud = require('gcloud');
var crypto = require('crypto');
var bodyParser = require('body-parser');


var app = express();
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
//app.use(bodyParser.json());

app.enable('trust proxy');

var dataset = gcloud.datastore({
  // This environment variable is set by app.yaml when running on GAE, but will
  // need to be manually set when running locally.
  //projectId: process.env.GCLOUD_PROJECT
  projectId: "airup-app"
});

app.get('/signups', function(req, res, next) {
  // Query the last 10 visits from the datastore.

  var query = dataset.createQuery('signup').limit(100);
  dataset.runQuery(query, function(err, entities) {
    if (err) { return next(err); }

    var signups = entities.map(function(entity) {
      return {
        "timestamp":entity.data.timestamp,
        // "email":entity.data.email,
        // "fullname":entity.data.fullname,
        "latlng":entity.data.latlng,
        "neighbourhood":entity.data.neighbourhood
      };
    });

    res.set('Content-Type', 'application/json');
    res.status(200).send(signups);
  });
});

app.post('/signup', function(req, res, next) {
  var hash = crypto.createHash('sha256');
  // Add this visit to the datastore
  dataset.save({
    key: dataset.key('signup'),
    data: {
      timestamp: new Date(),
      fullname: req.body.fullname,
      email:req.body.email,
      latlng:req.body.latlng,
      neighbourhood: req.body.neighbourhood,
      userIp: hash.update(req.ip).digest('hex').substr(0, 7)

    }
  }, function(err) {
    if (err) { return next(err); }

    // Query the last 10 visits from the datastore.
    var query = dataset.createQuery('visit')
      .order('-timestamp')
      .limit(10);

    dataset.runQuery(query, function(err, entities) {
      if (err) { return next(err); }

      var visits = entities.map(function(entity) {
        return format(
          'Time: %s, AddrHash: %s',
          entity.data.timestamp,
          entity.data.userIp);
      });

      var output = format('Last 10 visits:\n%s', visits.join('\n'));

      res.set('Content-Type', 'text/plain');
      res.status(200).send(true);
    });
  });
});

app.use(express.static(__dirname));


// [START hello_world]
// Say hello!
// app.get('/', function(req, res) {
//   res.status(200).send('Hello, world!');
// });
// [END hello_world]

if (module === require.main) {
  // [START server]
  // Start the server
  var server = app.listen(process.env.PORT || 8888, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('airup-app listening at http://%s:%s', host, port);
  });
  // [END server]
}

module.exports = app;
