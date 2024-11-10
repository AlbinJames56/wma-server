const express=require('express')
const adminController = require('../Controllers/adminController')
const galleryController=require("../Controllers/galleryController")
const router=express.Router() 
const multerConfig=require('../Middlewares/multerMiddleware')
const jwtMiddleware=require('../Middlewares/jwtMiddleware') 
 
 
// temporary router to create an admin
router.post('/register',adminController.registerAdmin)

// router for admin login
router.post('/adminLogin',adminController.adminLogin)

// addEvent
router.post('/addEvents',jwtMiddleware,multerConfig.single('eventPoster'),adminController.addEvents)

//getEvent
router.get("/getEvents",adminController.getEvents)

// updateEvent
router.put("/updateEvent/:eid",jwtMiddleware,multerConfig.single('eventPoster'),adminController.updateEvent)

// delete event
router.delete("/deleteEvent/:eid",jwtMiddleware,adminController.deleteEvent)

// getBooked ticekts
router.get("/get-booked-tickets",adminController.getBookedTickets)

// addCommittee
router.post("/addCommittee",adminController.addCommittee)

// fetch committee members
router.get("/getCommittee", adminController.getCommittee);

// delete committee member
router.delete("/delete/:id", adminController.deleteCommitteeMember);

// add image to gallery
router.post("/addImage", galleryController.addImage);

// get gallery images
router.get("/getImages", galleryController.getImages);

// delete gallery images
router.delete("/deleteImage/:id", galleryController.deleteImage);

module.exports=router