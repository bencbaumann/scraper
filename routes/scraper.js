const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const axios = require('axios');
const db = require('../models');

/* GET users listing. */
router.get('/', function (req, res, next) {
    axios.get('https://www.nytimes.com')
        .then(res => res.data)
        .then(html => {
            const $ = cheerio.load(html);
            const articles = [];
            $('article.story').each(function (i, element) {
                const article = {};
                const data = $(this);
                article.title = data.children('h2').text().trim();
                article.summary = data.children('p.summary').text().trim();
                article.link = data.children().children('a').attr('href');
                articles.push(article);
            });
            const responseArticles = articles
                .filter(article => article.title)
                .filter(article => article.summary)
            res.json(responseArticles);
        })

});

module.exports = router;