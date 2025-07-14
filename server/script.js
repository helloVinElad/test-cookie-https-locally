const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const https = require('https');
const http = require('http');

const app = express();
const fs = require('fs');


// Allow frontend to send cookies (credentials)
app.use(cors({
    origin: 'https://localhost:5500', // your frontend URL
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());


app.post('/login', (req, res) => {
    const token = 'abc123'; // will be a JWT later on

    res.cookie('authToken', token, {
        httpOnly: true,
        secure: true, // only sent over HTTPS
        sameSite: 'Strict', 
        maxAge: 60 * 60 * 1000 // 1 hour
    });

    res.json({ message: 'Logged in and cookie set' });
});


app.get('/secure-data', (req, res) => {
    const token = req.cookies.authToken;
    console.log(req.cookies)
    if (token === 'abc123') {
        res.json({ data: 'Secure information' });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

const options = {
    key: fs.readFileSync('localhost-key.pem'),
    cert: fs.readFileSync('localhost.pem')
  };
  
  
https.createServer(options, app).listen(4000, () => console.log('Server running on https://localhost:4000'));

http.createServer(app).listen(3000, () => {
    console.log('HTTP server running at http://localhost:3000');
  });