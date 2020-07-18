const express = require('express');

const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");

const routes = require('./routes/index');
const {DbHandler, StorageHandler} = require("./helpers");
// Instantiate express
const app = express();
// Set our port
const port = process.env.PORT || 8000;
// Configure app to user bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Register our routes in app
app.use('/', routes(app));

// resolve all initialisation promises and start server
Promise.all([
    DbHandler.Init(),       //  initialise db connection pool.
    StorageHandler.Init()   //  initialise remove file storage connection.
]).then(()=>{
    // Start our server
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
    }, function(err){
    console.error("Unable to start mongo db", err);
    }).catch(function(err){
    console.error("Unable to start mongo db", err);
    });

// Export our app for testing purposes
module.exports = app;
