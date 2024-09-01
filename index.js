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
    try {
        const orderData ={
         customer_details: {
           customer_id: `user_${number}`,
           customer_phone: number,
           customer_name: name
         },
         order_amount: amount,
         order_currency: "INR"
       }
        const Order_details = await Cashfree.PGCreateOrder('2023-08-01',orderData)
        console.log('Order_details: ', Order_details.data);
        const payment_Details = {
         customer_details: {
           customer_phone: number
         },
           link_meta: {
           upi_intent: true,
           payment_methods: "upi",
           return_url: "http://localhost:3000"
         },
         link_notify: {
           send_email: true
         },
         link_amount: 100,
         link_currency: "INR",
         "link_purpose": "Payment for BET 11",
         "link_id": `link_${Order_details?.data?.cf_order_id}`
       }
         const paymentRequest = await Cashfree.PGCreateLink('2023-08-01',payment_Details)
        res.json({ paymentLink: paymentRequest?.data?.link_url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Payment initiation failed.' });
    }
});

app.post('/notify', (req, res) => {
    console.log('Payment Notification:', req.body);
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
