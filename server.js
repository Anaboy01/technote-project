require("dotenv").config();

const express = require('express')
const app = express()
const path = require('path');
const cors = require('cors')



const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require('./config/corsOption');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const connectDB = require("./config/dbConnect");
const { error } = require("console");


// port declaration 
const PORT = process.env.PORT || 4500

console.log(process.env.NODE_ENV)

connectDB()
// cors()

app.use(logger)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())



app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))

app.use('/auth', require("./routes/authRoutes"))
app.use('/users', require("./routes/userRoutes"))
app.use('/notes', require("./routes/noteRoutes"))


app.all('*', (req, res) => {
      res.status(404);
      if(req.accepts('html')){
            res.sendFile(path.join(__dirname, 'views', '404.html'))
      }else if (req.accepts('json')){
            res.json({message: "404 not found"})
      }else{
            res.type('txt').send("404 not found")
      }
})


app.use(errorHandler)

// setting port listener 

mongoose.connection.once("open", () => {
      console.log("connected to mongoDB");
      app.listen(PORT, () => console.log(`server running on port: ${PORT}`));
    })

mongoose.connection.on("error", err => {
      console.log(err)
      logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
