const events = require("../Models/eventSchema");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: "rzp_test_NNSjPPGtQUisCc",
  key_secret: "a17aBmQRsYooxW8EEElNgkcL",
});

// Fetch events (existing function)
exports.fetchEvents = async (req, res) => {
  try {
    const allEvents = await events.find();
    res.status(200).json(allEvents);
  } catch (err) {
    res.status(401).json(err);
  }
};

// Create Razorpay Order
exports.createRazorpayOrder = async (req, res) => {
  const { amount } = req.body; // Amount should be in INR, no decimals (e.g., 500 for ₹500)
//   console.log("Razor", amount);

  try {
    // Razorpay order options
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `receipt_${new Date().getTime()}`,
      payment_capture: 1, // Auto-capture payment
    };

    // Create an order on Razorpay
    const order = await razorpay.orders.create(options);

    res.status(200).json(order); // Send order details back to frontend
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
};

// Verify Razorpay Payment
exports.verifyRazorpayPayment = async (req, res) => {
//   console.log("inside verify", req.body);

  const { payment_id, order_id, signature } = req.body;

  try {
    const shasum = crypto.createHmac("sha256", "a17aBmQRsYooxW8EEElNgkcL");
    shasum.update(order_id + "|" + payment_id);
    const digest = shasum.digest("hex");
     
    if (digest === signature) {
      // Payment is verified, you can perform further actions like storing payment details in the DB
       
      res.status(200).json({ status: "success", message: "Payment verified" });
    } else {
      res
        .status(400)
        .json({ status: "failed", message: "Payment verification failed" });
      console.log("moc ver");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
