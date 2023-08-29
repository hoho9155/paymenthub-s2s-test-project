const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
const bodyParser = require("body-parser");
const port = 3001; // You can change this to your preferred port


app.use(bodyParser.urlencoded({ extended: false }));
// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a route
app.get('/', (req, res) => {
    res.render('index', { title: 'Express EJS Project' });
});


app.get('/test/3d/initialize', async (req, res) => {
 
  const res3d = await axios.post('https://paymenthub.uk/api/payment/3d/initialize', {
    "mid": "merchant1",
    "firstName": "Test",
    "lastName": "User",
    "email": "merchant1@paymenthub.com",
    "phone": "+37126345934",
    "address": "Test address",
    "city": "London",
    "state": "London",
    "country": "GBR",
    "zipCode": "1234567",
    "amount": "1",
    "currency": "USD",
    "cardType": "VISA",
    "cardName": "Test User",
    "cardNumber": "5123450000000008",
    "cardCVV": "123",
    "cardExpYear": "23",
    "cardExpMonth": "12",
    "orderId": "LV07ER4RRKC4",
    "orderDetail": "Test payment",
    "clientIp": "35.195.77.158",
    "redirectUrl": "http://localhost:3001/test/3d/pay",
    "callbackUrl": "http://localhost:3001/test/3d/callback",
  }, {
    headers: {
      'x-api-key': '0701050dde1b146e99fb3705fef896bb217b6c40cc87b5ea8f670d26d7d91c52',
      'Content-Type': 'application/json'
    }
  }).then(response => response.data);
  
  if (res3d.status !== 'success') {
    return res.status(200).json(res3d);
  }

  return res.render('test_3d_initialize.ejs', {
    content: res3d.html
  });
});

app.post('/test/3d/pay', async (req, res) => {
  const data = req.body;
  let context = {};

  if (data.result !== 'SUCCESS' || data['response.gatewayRecommendation'] !== 'PROCEED') {
    context = { status: 'failed' };
  } else {

    const res3d = await axios.post('https://paymenthub.uk/api/payment/3d/pay', {
      mid: "merchant1",
      order_id: data['order.id']
    }, {
      headers: {
        'x-api-key': '0701050dde1b146e99fb3705fef896bb217b6c40cc87b5ea8f670d26d7d91c52',
        'Content-Type': 'application/json'
      }
    }).then(response => response.data);
    console.log('res3d', res3d)
    context = { status: res3d.status, result: res3d.result };
  }
  return res.render('test_3d_pay_complete.ejs', context);
});

app.post('/test/3d/callback', async (req, res) => {
  console.log(req.body);
  res.end();
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});