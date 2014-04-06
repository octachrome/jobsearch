var fs = require('fs')
var express = require('express');
var model = require('./model');

var app = express();

app.use(express.json());

app.get('/rest/companies', model.getCompanies);
app.post('/rest/companies/:id', model.saveCompany);

app.use(express.static('web'));

app.listen(8080);
