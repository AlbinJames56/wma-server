const events = require("../Models/eventSchema");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const qr = require("qrcode");
const HandleTicketGeneration = require("./ticketController");
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
  console.log("inside verify", req.body);
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
    const shasum = crypto.createHmac("sha256", "a17aBmQRsYooxW8EEElNgkcL");
    shasum.update(order_id + "|" + payment_id);
    const digest = shasum.digest("hex");
    // console.log("digest",digest);
    // console.log("signature",signature);

    if (digest === signature) {
      // Payment is verified, you can perform further actions like storing payment details in the DB
      // Fetch event details
      const eventDetails = await events.findById(eventId).lean();
      console.log("event", eventDetails.tickets);

      if (!eventDetails)
        return res.status(404).json({ error: "Event not found" });

      // Find the ticket type matching `ticketType`
      const selectedTicketType = eventDetails.tickets.find(
        (ticket) => ticket.name === ticketType
      );

      // Extract pricing information based on the `ticketCount` object
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
        eventName: eventDetails.title,
        location: `${eventDetails.event_location}, ${eventDetails.state}, ${eventDetails.country}`,
        when: `${eventDetails.event_date}, ${eventDetails.event_time}`,
        name: customerName,
        email: customerEmail,
        section: ticketType,
        ticketCount,
        pricing,
        terms: eventDetails.terms,
      };
      console.log("ticket", ticketData);
      // Generate QR code and create the ticket PDF
      qr.toDataURL(ticketData.regId, { errorCorrectionLevel: "H" })
        .then(async (qrCodeData) => {
          ticketData.qrCodeData = qrCodeData;
          await HandleTicketGeneration(ticketData); // Generates ticket PDF and sends email
        })
        .catch((error) => {
          console.error("Error generating QR code:", error);
          HandleTicketGeneration(ticketData);
        });

      res.status(200).json({
        status: "success",
        message: "Payment verified and ticket sent",
      });
    } else {
      res
        .status(400)
        .json({ status: "failed", message: "Payment verification failed" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
