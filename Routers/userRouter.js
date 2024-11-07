const express=require('express')
const userController = require('../Controllers/userControllers')
const router=express.Router()  

//fetch event for user page
router.get("/fetchEvents",userController.fetchEvents)


module.exports=router