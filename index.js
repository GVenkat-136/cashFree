require('dotenv').config();
const express = require('express');
const path = require('path');
const {Cashfree} = require('cashfree-pg');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = process.env.CASHFREE_ENVIRONMENT;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/pay', async (req, res) => {
    const { amount , number , name} = req.body;
    console.log('amount: ', amount);
    try {
        const orderData ={
         customer_details: {
           customer_id: `user_${number}`,
           customer_phone: number,
           customer_name: name
         },
         order_amount: amount,
         order_currency: "INR",
         order_meta: {
          return_url: "http://localhost:3000/",
          payment_methods: "upi"
        }
       }
        const Order_details = await Cashfree.PGCreateOrder('2023-08-01',orderData)
        res.status(200).send(Order_details?.data);
    } catch (error) {
        res.status(500).json({ error: 'Payment initiation failed.' });
    }
});

app.post('/notify', (req, res) => {
    console.log('Payment Notification:', req.body);
    res.sendStatus(200);
});

app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'payment.html'));
})
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
