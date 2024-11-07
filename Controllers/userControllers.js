
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