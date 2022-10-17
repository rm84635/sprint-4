const fs = require('fs');
const express = require('express');
const Mustache = require('mustache');
const axios = require('axios');

const app = express();
const port = 1337;

const baseURL = 'http://localhost:3000';

const config = {
  headers: {
    'Content-Type': 'application/json'
  },

  auth: {
    username: 'julio',
    password: 'facal'
  }
};

function getEmails() {
  return axios.get(`${baseURL}/email`, config);
}

function getProdutos() {
  return axios.get(`${baseURL}/produto`, config);
}

function renderTemplate(name, data) {
  return Mustache.render(
    fs.readFileSync(`./src/templates/${name}.mustache`).toString(),
    data
  );
}

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));

app.get('/', (_, res) => {
  Promise.all([getEmails(), getProdutos()])
    .then(function(results) {
      const emails = results[0].data;
      const produtos = results[1].data;

      res.send(renderTemplate('index', {
        emails: emails,
        produtos: produtos
      }));
    });
});

app.post('/produto', (req, res) => {
  axios.post(`${baseURL}/produto`, req.data, config);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Executando na porta ${port}`);
});
