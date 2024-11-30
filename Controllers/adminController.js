const admin = require("../Models/adminSchema");
const events = require("../Models/eventSchema");
const bookedTicketSchema=require("../Models/bookedTickets")
const committeeMembers = require("../Models/committee"); 
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');



// admin register
exports.registerAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if the admin username already exists
    const existingAdmin = await admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin username already exists" });
    }
    // Hash the password before saving it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new admin with the hashed password
    const newAdmin = new admin({ username, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server error" });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await admin.findOne({ username });
    if (!user) {
      return res.status(401).json({ msg: "incorrect username" });
    }
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      return res.status(401).json({ msg: "incorrect password" });
    }
    const payload = {
      id: user._id,
    };
    const signOptions = {
      expiresIn: "23h",
    };
    const token = jwt.sign(payload, process.env.jwt_secret, signOptions);

    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
};

// addEvents
exports.addEvents = async (req, res) => {
  // console.log("inside addeevents");
  const {
    title,
    description,
    event_time,
    event_date,
    event_location_url,
    event_location,
    state,
    country,
    terms,
    regOpen,
  } = req.body;
  const tickets = JSON.parse(req.body.tickets);
  const eventPoster = req.file.filename;

  try {
    const newEvent = new events({
      title,
      description,
      event_time,
      event_date,
      event_location_url,
      event_location,
      state,
      country,
      tickets,
      eventPoster,
      terms,
      regOpen,
    });
    await newEvent.save();

    res.status(200).json(newEvent);
    // }
  } catch (err) {
    console.log("catch", err);

    res.status(401).json(err);
  }
};

// getEvents
exports.getEvents = async (req, res) => {
  // console.log("inside getEvents");
  try {
    const allEvents = await events.find();
    res.status(200).json(allEvents);
  } catch (err) {
    res.status(401).json(err);
  }
};

// updateEvent
exports.updateEvent = async (req, res) => {
  console.log("inside update");
  const {
    title,
    description,
    event_time,
    event_date,
    event_location_url,
    event_location,
    state,
    country,
    terms,
    regOpen,
  } = req.body;
  const tickets = JSON.parse(req.body.tickets);
  const updateData = {
    title,
    description,
    event_time,
    event_date,
    event_location_url,
    event_location,
    state,
    country,
    terms,
    regOpen,
    tickets,
  };
  // Conditionally add eventPoster if a new file was uploaded
  if (req.file && req.file.filename) {
    updateData.eventPoster = req.file.filename;
  }
  const { eid } = req.params;
  try {
    const updatedEvent = await events.findByIdAndUpdate(eid, updateData, {
      new: true,
    });
    await updatedEvent.save();
    res.status(200).json(updatedEvent);
  } catch (err) {
    console.log(err);
    res.status(401).json(err);
  }
};

// delete Event
exports.deleteEvent = async (req, res) => {
  const { eid } = req.params;
  console.log("inside delete", eid);
  try {
    const deleteData = await events.findByIdAndDelete(eid);
    // Check if the event was found and deleted
    if (!deleteData) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(deleteData);
  } catch (err) {
    console.log(err);
    res.status(401).json(err);
  }
};

// getBookedTickets
exports.getBookedTickets=async(req,res)=>{
  // console.log("inside getBOokedTicekts");
  try{
    const bookedEvents = await bookedTicketSchema.find();
 
    res.status(200).json(bookedEvents);
  }catch (err) {
    res.status(401).json(err);
  }
}

// addCommittee
exports.addCommittee=async(req,res)=>{
  console.log("inside add committee");
  try{
    const newCommittee=new  committeeMembers(req.body)
    await newCommittee.save()
    res.status(201).json(newCommittee);
  } catch (err) {
    console.error("Error adding committee member:", err);
    res.status(500).json({ message: "Failed to add committee member" });
  }
  
}

// fetch committee 
exports.getCommittee = async (req, res) => {
  console.log("inside get committee");
  try {
    const committee = await committeeMembers.find();
    res.status(200).json(committee);
  } catch (error) {
    res.status(500).json({ message: "Error fetching committee members" });
  }
};

// delete committee member 
exports.deleteCommitteeMember = async (req, res) => {
  try {
    const { id } = req.params;
    await committeeMembers.findByIdAndDelete(id);
    res.status(200).json({ message: "Committee member deleted successfully" });
  } catch (error) {
    console.error("Error deleting committee member:", error);
    res.status(500).json({ error: "Failed to delete committee member" });
  }
};