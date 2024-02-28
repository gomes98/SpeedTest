const express = require('express');
const app = express();
const crypto = require('crypto');

app.use(express.json());
app.use('/', express.static('www'));

app.get('/speed', async function (req, res) {
    let loops = 1024 * (parseInt(req.query.mb) || 50);
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Content-Description', 'File Transfer')
    res.set('Content-Type', 'application/octet-stream')
    res.set('Content-Length', loops * 1024)
    for (let index = 0; index < loops; index++) {
        // if(index % 2){
        //     await timeout(1);   
        // }
        res.write(crypto.randomBytes(1024))
    }
    res.end()
});

async function timeout(ms){
    return new Promise((resolve) => setTimeout(resolve, ms))
}

app.listen(3333)