const express=require('express')
const adminController = require('../Controllers/adminController')
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

module.exports=router