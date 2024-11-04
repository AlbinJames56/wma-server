const express=require('express')
const { registerAdmin, adminLogin,addEvents } = require('../Controllers/adminController')
const router=express.Router() 
const multerConfig=require('../Middlewares/multerMiddleware')
const jwtMiddleware=require('../Middlewares/jwtMiddleware') 
 

// temporary router to create an admin
router.post('/register',registerAdmin)

// router for admin login
router.post('/login',adminLogin)

// addEvent
router.post('/addEvents',multerConfig.single('eventPoster'),addEvents)
module.exports=router