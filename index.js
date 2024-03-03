require('dotenv').config()
const express = require('express');
const app = express();
const crypto = require('crypto');
const { Readable } = require('stream');

app.use(express.json());
app.use('/', express.static('front'));

app.get('/speed', async function (req, res) {
    let loops = (parseInt(req.query.mb) || 500);
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Content-Description', 'File Transfer')
    res.set('Content-Type', 'application/octet-stream')
    res.set('Content-Length', loops * (1024 * 1024))
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
});

app.use('/empty', (req, res) => {
    res.writeHead(200, {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0, s-maxage=0",
        "Cache-Control": "post-check=0, pre-check=0",
        "Pragma": "no-cache",
        "Connection": "keep-alive",
    });
    return res.end();
});

app.use('/getip', (req, res) => {
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    ip = ip.replace(/^::ffff:/, '');
    let filter = getLocalOrPrivateIpInfo(ip);
    res.send({ processedString: `${ip} - ${filter}` });
});

// verifica se o ip é local ou privado
function getLocalOrPrivateIpInfo(ip = "") {
    // ::1/128 is the only localhost ipv6 address. there are no others, no need to strpos this
    if ('::1' === ip) {
        return 'localhost IPv6 access';
    }

    // simplified IPv6 link-local address (should match fe80::/10)
    if (ip.indexOf('fe80:') === 0) {
        return 'link-local IPv6 access';
    }

    // anything within the 127/8 range is localhost ipv4, the ip must start with 127.0
    if (ip.indexOf('127.') === 0) {
        return 'localhost IPv4 access';
    }

    // 10/8 private IPv4
    if (ip.indexOf('10.') === 0) {
        return 'private IPv4 access';
    }

    // 172.16/12 private IPv4
    if (ip.match('/^172\.(1[6-9]|2\d|3[01])\./', ip) === 1) {
        return 'private IPv4 access';
    }

    // 192.168/16 private IPv4
    if (ip.indexOf('192.168.') === 0) {
        return 'private IPv4 access';
    }

    // IPv4 link-local
    if (ip.indexOf('169.254.') === 0) {
        return 'link-local IPv4 access';
    }

    return null;
}

app.listen(process.env.HTTP_PORT || 3333, () => {
    console.log(`Server running on port ${process.env.HTTP_PORT || 3333}`);
});