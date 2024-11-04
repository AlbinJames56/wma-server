const admin= require('../Models/adminSchema') 
const jwt=require('jsonwebtoken');

// admin register
exports.registerAdmin  = async (req, res) => {
  const { username, password } = req.body;
  
  try {
      // Check if the admin username already exists
      const existingAdmin = await admin.findOne({ username });
      if (existingAdmin) {
          return res.status(400).json({ message: 'Admin username already exists' });
      }
      // Hash the password before saving it
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create a new admin with the hashed password
      const newAdmin = new admin({ username, password: hashedPassword });
      await newAdmin.save();

      res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
};

exports.adminLogin = async (req, res) => {
  try {
      const { username, password } = req.body;
      let user = await admin.findOne({ username });
      if (!user) {
          return res.status(401).json({ msg: 'incorrect username' });
      }
      const isCorrect = await bcrypt.compare(password, user.password);

      if (!isCorrect) {
          return res.status(401).json({ msg: 'incorrect password' });
      }

      const payload = {
          id: user._id,
      };

      const signOptions = {
          expiresIn: "23h",
      }

      const token = jwt.sign(
          payload,
          process.env.jwt_secret,
          signOptions
      );

      res.json({ token });
  } catch (err) {
      console.log(err);
      res.status(500).send('Server error');
  }
}

// addEvents
exports.addEvents = async (req, res) => {
    console.log("inside addeevents");
    
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
    // const existingEvent = await events.find({ title, event_time });
    // if (existingEvent) {
    //   res
    //     .status(406)
    //     .json(
    //       "Event already exists in our collections, please upload another one"
    //     );
    // } else { 
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
    res.status(401).json(err);
  }
};
