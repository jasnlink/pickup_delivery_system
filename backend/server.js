import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql';
import fileUpload from 'express-fileupload';
import path from 'path';
import otpService from 'otp-generator';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

//read .env file
dotenv.config();
// disable TLS for testing mail SMTP
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;


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
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

//secret keys declaration, to be fetched from DB
var OTP_SECRET_KEY = null;
var AWS_SNS_ACCESS_KEY_ID = null; 
var AWS_SECRET_ACCESS_KEY = null;
const AWS_REGION='ca-central-1';


// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 25,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // generated ethereal user
      pass: process.env.SMTP_PASSWORD, // generated ethereal password
    },
});

//express json cors setup
var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({extended: true}));


//file upload
app.use(express.static(CDN_DIR));
app.use(fileUpload({
    limits: {
        fileSize: 1024 * 10240 // 10 MB
    },
    abortOnLimit: true
 }));



//auto connect and reconnect to database function
function connectToDb(callback) {
  const attemptConnection = () => {
    console.log('connecting to database...')
    connectionInfo.connectTimeout = 2000 // same as setTimeout to avoid server overload 
    connection = mysql.createConnection(connectionInfo)
    connection.connect(function (err) {
      if (err) {
        console.log('error connecting to database, trying again in 2 secs...')
        connection.destroy() // end immediately failed connection before creating new one
        setTimeout(attemptConnection, 2000)
      } else {
        callback()
      }
    })
    connection.on('error', function(err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('renewing database connection...');
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

    //fetch secret keys for APIs
    if(!OTP_SECRET_KEY) {
        const query = "SELECT * FROM osd_keys;";
        connection.query(query, (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            //
            OTP_SECRET_KEY = result[0].key_value;
            AWS_SNS_ACCESS_KEY_ID = result[1].key_value;
            AWS_SECRET_ACCESS_KEY = result[2].key_value;
            console.log('initialising keys... ');
        })
    }
})

app.listen(PORT, () => console.log(`server is running on port ${PORT}.`));


// generate OTP hash
function newHashOTP(user, otp){
    
    const ttl      = 5 * 60 * 1000; //5 Minutes in miliseconds
    const expires  = Date.now() + ttl; //timestamp to 5 minutes in the future
    const data     = `${user}.${otp}.${expires}`; // phone.otp.expiry_timestamp
    const hash     = crypto.createHmac("sha256",OTP_SECRET_KEY).update(data).digest("hex"); // creating SHA256 hash of the data
    const fullHash = `${hash}.${expires}`; // Hash.expires, format to send to the user

    return fullHash;
}

// verify OTP hash
function verifyHashOTP(user,hash,otp){
    // Seperate Hash value and expires from the hash returned from the user
    let [hashValue,expires] = hash.split(".");
    // Check if expiry time has passed
    let now = Date.now();
    if(now>parseInt(expires)) return false; //otp expired
    // Calculate new hash with the same key and the same algorithm
    let data  = `${user}.${otp}.${expires}`;
    let newCalculatedHash = crypto.createHmac("sha256",OTP_SECRET_KEY).update(data).digest("hex");
    // Match the hashes
    if(newCalculatedHash === hashValue){
        return true;
    } 
    return false;
}


// check if user email or phone is in DB
//  -->IF EXIST IN DB
//      prepare OTP with hash
//      send to Amazon SNS
//  2nd route to verify OTP key 

//  -->IF DOES NOT EXIST IN DB




// async..await is not allowed in global scope, must use a wrapper
async function sendOtpMail(otp, user) {

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Restaurant 2K Fusion" <noreply@2kfusion.com>', // sender address
    to: user, // list of receivers
    subject: "Votre code de vérification", // Subject line
    text: "Votre code de vérification est: "+otp, // plain text body
    html: "Votre code de vérification est: <b>"+otp+"</b><br /><br />", // html body
  });

  console.log("sending otp mail... %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

}


//check if email is in DB so user can login
app.post('/api/login/submit', (req, res) => {

        const email = req.body.email;

        // generate a 6 digit numeric OTP
        const otp = otpService.generate(6, {lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
        // generate unique hash to verify email
        const hash = newHashOTP(email, otp);
        console.log('generating new OTP...');
        sendOtpMail(otp, email)
        .then((e) => {res.json({hash:hash})})
        .catch(console.error);
        
/*
        //search for email in DB
        const query = "SELECT * FROM osd_users WHERE user_email=?;";
        connection.query(query, [email], (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('logging in with email...');


            //if email is found
            if(result.length > 0) {
                console.log('user found...');
                // Generate a 6 digit numeric OTP
                const otp = otpService.generate(6, {alphabets: false, upperCase: false, specialChars: false});
                console.log('user found...');
                const hash = newHashOTP(email, otp);
                res.json({message:hash,otp:otp});

                return;
            }

            //if no email is found 
            if(result.length === 0) {
                console.log('no user found...');
                res.json({status:3,message:'Username doesn\'t exist.'});
                return;
            }

    });
   */
});


//check if email is in DB so user can login
app.post('/api/login/verify', (req, res) => {

        const email = req.body.email;
        const hash = req.body.hash;
        const otp = req.body.otp;

        console.log('verify otp... '+hash);
        const verify = verifyHashOTP(email,hash,otp);

        if(verify) {
            //otp is verified
            console.log('otp verified...')

            //search for email in DB
            const query = "SELECT * FROM osd_users WHERE user_email=?;";
            connection.query(query, [email], (err, result) => {
                if(err) {
                    res.status(400).send(err);
                    return;
                }
                console.log('logging in with email...');
                //if email is found
                if(result.length > 0) {
                    console.log('found user...')
                    res.send(result);
                }
                //if no email is found 
                if(result.length === 0) {
                    console.log('no user found...');
                    res.json({status:0,verify:1});
                    return;
                }
            });
        } else {
            //otp wrong, so try again
            console.log('otp wrong...')
            res.json({status:0,verify:0});
        }
});



// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Restaurant 2K Fusion" <noreply@2kfusion.com>', // sender address
    to: "chem9310@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

//check if email is in DB so user can login
app.get('/api/mail/test', (req, res) => {

    main().catch(console.error);
})
