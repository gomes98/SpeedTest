const express = require('express');
const app = express();
const crypto = require('crypto');
const { Readable } = require('stream');

app.use(express.json());
app.use('/', express.static('front'));
// app.use('/', express.static('www'));

app.get('/speed', async function (req, res) {
    let loops = (parseInt(req.query.mb) || 500);
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Content-Description', 'File Transfer')
    res.set('Content-Type', 'application/octet-stream')
    res.set('Content-Length', loops * (1024 * 1024))
    console.log("INICIOU");
    console.time(`teste:${loops}Mb`)
    let rand = crypto.randomBytes(1024)
    const inStream = new Readable({
        read() {
            this.push(rand)
        }
    });
    inStream.pipe(res)
    inStream.on('end', () => {
        res.end();
    });
    console.timeEnd(`teste:${loops}Mb`)
});

app.use('/empty', (req, res) => {
    console.log("empty");
    res.writeHead(200, {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0, s-maxage=0",
        "Cache-Control": "post-check=0, pre-check=0",
        "Pragma": "no-cache",
        "Connection": "keep-alive",
    });
    return res.end();
})

app.use('/getip', (req, res) => {
    console.log("getip");
    res.send(`${req.socket.remoteAddress}`)
})

async function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

app.listen(3333)