const http = require('http');
const exec = require('child_process').exec;
var express = require('express');
var bodyParser = require('body-parser');
const helmet = require('helmet')
import { createHmac } from 'crypto';

// settings
const secret = 'WEBHOOK SECRET';
const prod = 'PATH TO MASTER BRANCH';
const staging = 'PATH TO STANGING BRANCH';

var app = express();

app.use(bodyParser.json());
app.use(helmet());


app.post('/', function (req, res) {
  // Github signature
  const signature = req.get('X-Hub-Signature');
  let hmac = createHmac('sha1', secret);
  hmac.update(JSON.stringify(req.body));

  // Our digest
  const digest = 'sha1=' + hmac.digest('hex');

  if (signature === digest) {
    console.log(signature + '===' + digest);
    if (req.body.ref == 'refs/heads/master') {
      exec('cd ' + prod + ' && npm run build');
    }
    else if (req.body.ref == 'refs/heads/staging') {
      exec('cd ' + staging + ' && run build');
    }
  }
});

// We use a port 8091
app.listen(process.env.PORT || 8091);
module.exports = app;
