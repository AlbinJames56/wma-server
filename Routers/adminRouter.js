const express=require('express')
const adminController = require('../Controllers/adminController')
const router=express.Router() 
const multerConfig=require('../Middlewares/multerMiddleware')
const jwtMiddleware=require('../Middlewares/jwtMiddleware') 
 
router.get('/test', (req, res) => {
    res.status(200).send("Test route in adminRouter is working");
});
// temporary router to create an admin
router.post('/register',adminController.registerAdmin)

// router for admin login
router.post('/adminLogin',adminController.adminLogin)

// addEvent
router.post('/addEvents',multerConfig.single('eventPoster'),adminController.addEvents)

module.exports=router