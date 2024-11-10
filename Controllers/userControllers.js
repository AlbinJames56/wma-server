const { findByIdAndUpdate } = require("../Models/adminSchema");
const events = require("../Models/eventSchema");

// router to get Events in user home
exports.fetchEvents = async (req, res) => {
  // console.log("inside fetch events");
  try {
    const allEvents = await events.find();
    res.status(200).json(allEvents);
  } catch (err) {
    res.status(401).json(err);
  }
};

exports.updateTicketCount = async (req, res) => {
  // console.log("Inside update event");
  try {
    const { eventId, ticketType, ticketCount } = req.body;
    // Find the event
    const event = await events.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Calculate the total ticket count to subtract
    const totalTicketCount = Object.values(ticketCount).reduce(
      (acc, count) => acc + count,
      0
    );
    // Find and update the ticket count for the specified ticket type
    let ticketFound = false;
    for (let i = 0; i < event.tickets.length; i++) {
      if (event.tickets[i].name === ticketType) {
        event.tickets[i].ticketCount -= totalTicketCount;
        console.log(
          "Updated ticket count for",
          ticketType,
          ":",
          event.tickets[i].ticketCount
        );

        ticketFound = true;
        break; // Exit the loop after updating the ticket count
      }
    }
    if (!ticketFound) {
      return res.status(404).json({ message: "Ticket type not found" });
    }

    // Save the updated event
    const newEvent = await events.findByIdAndUpdate({ _id: eventId }, event, {
      new: true,
    });

    console.log("Ticket count updated successfully");
    return res
      .status(200)
      .json({ message: "Ticket count updated successfully" });
  } catch (error) {
    console.error("Error updating ticket count:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
};
