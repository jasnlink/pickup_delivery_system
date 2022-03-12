import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql';
import fileUpload from 'express-fileupload';
import path from 'path';



// set current working directory
const __dirname = path.resolve();
// public image directory
const CDN_DIR = path.join(__dirname, 'public');
// set website address
const SITE = 'https://mitsuki.qbmenu.ca/';
// set port, listen for requests
const PORT = process.env.PORT || 3500;

//database connection info
var connection;
const connectionInfo = {
    host: '127.0.0.1', 
    user:'admin', 
    password: '29sGp%jYbk!GhxY',
    database: 'order_system_db'
};

var app = express();
app.use(cors());
app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(cdnDir));
app.use(fileUpload({
    limits: {
        fileSize: 1024 * 10240 // 10 MB
    },
    abortOnLimit: true
 }));

//auto connect and reconnect to database function
function connectToDb(callback) {
  const attemptConnection = () => {
    console.log('Connecting to database...')
    connectionInfo.connectTimeout = 2000 // same as setTimeout to avoid server overload 
    connection = mysql.createConnection(connectionInfo)
    connection.connect(function (err) {
      if (err) {
        console.log('Error connecting to database, trying again in 2 secs...')
        connection.destroy() // end immediately failed connection before creating new one
        setTimeout(attemptConnection, 2000)
      } else {
        callback()
      }
    })
    connection.on('error', function(err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Renewing database connection...');
        } else {
            console.log('database error...', err);
        }
        attemptConnection();
    });

  }
  attemptConnection()
}
// now you simply call it with normal callback
connectToDb( () => {
    console.log("Connected to database!");
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));