const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const app = express();
const { PORT, API_KEY, COUNTRY } = require('./config');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('voice');
});


app.get('/news', (req, res) => {
    const { category } = req.query;
    const URL = `https://newsapi.org/v2/top-headlines?country=${COUNTRY}&category=${category}&apiKey=${API_KEY}`;
    fetch(URL)
        .then(result => result.json())
        .then(json => res.json(json))
        .catch(err => {
            res.status(400).send({
                message: 'Something went wrong'
            })
        });
});


app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));