 
const mongoose = require("mongoose");

const bookedTicketSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  eventName: { type: String, required: true },
  location: { type: String, required: true },
  when: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  section: { type: String, required: true },
  ticketCount: { type: Map, of: Number, required: true },  
  pricing: { type: Map, of: Number, required: true },  
  regId: { type: String, unique: true, required: true },
  qrCodeData: { type: String }, // stores the QR code data as a string
  terms: { type: String },
  paymentId: { type: String, required: true }, // Razorpay payment ID for tracking
  orderId: { type: String, required: true }, // Razorpay order ID
  signature: { type: String, required: true }, // Razorpay signature for verification
}, { timestamps: true });

const BookedTickets = mongoose.model("BookedTickets", bookedTicketSchema);

module.exports = BookedTickets;
