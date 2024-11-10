const events = require("../Models/eventSchema");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const qr = require("qrcode");
const HandleTicketGeneration = require("./ticketController");
const BookedTickets = require("../Models/bookedTickets");
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
  // console.log("Razor", amount);

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
  const {
    payment_id,
    order_id,
    signature,
    eventId,
    ticketType,
    ticketCount,
    customerEmail,
    customerName,
  } = req.body;

  try {
    // Verify Razorpay signature
    const shasum = crypto.createHmac("sha256", "a17aBmQRsYooxW8EEElNgkcL");
    shasum.update(order_id + "|" + payment_id);
    const digest = shasum.digest("hex");

    if (digest === signature) {
      // Fetch event details
      const eventDetails = await events.findById(eventId).lean();
      if (!eventDetails) return res.status(404).json({ error: "Event not found" });

      // Find the selected ticket type and prepare pricing information
      const selectedTicketType = eventDetails.tickets.find(
        (ticket) => ticket.name === ticketType
      );

      const pricing = {};
      if (selectedTicketType) {
        Object.keys(ticketCount).forEach((category) => {
          const categoryObj = selectedTicketType.categories.find(
            (cat) => cat.name === category
          );
          if (categoryObj) {
            pricing[category] = categoryObj.price;
          }
        });
      }

      // Prepare ticket data
      const ticketData = {
        regId: `${new Date().getTime()}`, // Unique registration ID
        eventId,
        eventName: eventDetails.title,
        location: `${eventDetails.event_location}, ${eventDetails.state}, ${eventDetails.country}`,
        when: `${eventDetails.event_date}, ${eventDetails.event_time}`,
        name: customerName,
        email: customerEmail,
        section: ticketType,
        ticketCount,
        pricing,
        terms: eventDetails.terms,
        paymentId: payment_id,
        orderId: order_id,
        signature,
      };

      // Generate QR code
      const qrCodeData = await qr.toDataURL(ticketData.regId, { errorCorrectionLevel: "H" });
      ticketData.qrCodeData = qrCodeData;

      // Save ticket data in the database (bookedTickets collection)
      const newBookedTicket = new BookedTickets(ticketData);
      await newBookedTicket.save();

      // Generate ticket PDF and send email (assuming HandleTicketGeneration does this)
      await HandleTicketGeneration(ticketData);

      res.status(200).json({
        status: "success",
        message: "Payment verified and ticket sent",
      });
    } else {
      res.status(400).json({ status: "failed", message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error in payment verification:", error);
    res.status(500).json({ error: "An error occurred during payment verification" });
  }
};