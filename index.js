
require("dotenv").config();

const express = require("express");

const cors = require("cors");

const adminRouter = require("./Routers/adminRouter");

const userRouter = require("./Routers/userRouter");

const bodyParser = require("body-parser");


const wmaServer = express();
require("./DB/connection");

// Increase the body-parser limit to handle large payloads
wmaServer.use(bodyParser.json({ limit: "50mb" }));
wmaServer.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

wmaServer.use(cors());
wmaServer.use(express.json());  
wmaServer.use("/AdminRouter",adminRouter);
wmaServer.use("/UserRouter",userRouter);
wmaServer.use("/uploads",express.static("./uploads/"))  //used for uploading content

const PORT = 3000;
wmaServer.listen(PORT, () => {
  console.log("Server started on port :", PORT);
});
wmaServer.get("/", (req, res) => {
  res
    .status(200)
    .send("<h1 style=color:red>Wma server running and wait to client request</h1>");
});
