const express=require('express')
const userController = require('../Controllers/userControllers');
const razorPay = require('../Controllers/razorPay');
const router=express.Router()  
 
//fetch event for user page
router.get("/fetchEvents",userController.fetchEvents)
 
// Create a Razorpay Order
router.post("/create-order", razorPay.createRazorpayOrder);

// Verify Razorpay Payment
router.post("/verify-payment", razorPay.verifyRazorpayPayment);


module.exports=router