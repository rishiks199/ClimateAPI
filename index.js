const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const PORT = process.env.PORT || 80;

const articles = [];
const newspapers = [
    {
        name:'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base:''
    },
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base:''
    },
    {
        name: 'Telegraph',
        address: 'https://www.telegraph.co.uk/climate-change',
        base: 'https://www.telegraph.co.uk'
    }
];

newspapers.forEach((newspaper)=>{

    const newsAddress = newspaper.address
    const base = newspaper.base;

    axios.get(newsAddress)
    .then((response)=>{
        const html = response.data;
        const $ = cheerio.load(html);

        $('a:contains("climate")',html).each(function () {
            const title = $(this).text();
            const url = $(this).attr('href');
            articles.push({
                title,
                url: base+url,
                source: newspaper.name
            })
        })
    }).catch((err) => {
        console.log('Error',err);
    })


})
app.get('/home',(req,res)=>{
    res.send('<h1>Welcome to Home page of News for Climate</h1>');
})

app.get('/news',(req,res)=>{
    res.json(articles);
})

app.get('/news/:newspaperId',(req,res)=>{

    const newspaperId = req.params.newspaperId;
    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address;
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base;
   const specificArticles = [];
    axios.get(newspaperAddress)
    .then((response)=>{
        const html = response.data;
        const $ = cheerio.load(html);

        $('a:contains("climate")',html).each(function () {
            const title = $(this).text();
            const url = $(this).attr('href');
            specificArticles.push({
                title,
                url: newspaperBase+url,
                source: newspaperId
            })
        })
        res.json(specificArticles);
    }).catch((err) => {
        console.log('Error',err);
    })

})

app.listen(PORT, ()=>{
    console.log(`Server listening on ${PORT}`);
});