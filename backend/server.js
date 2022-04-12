import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql';
import fileUpload from 'express-fileupload';
import path from 'path';
import otpService from 'otp-generator';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import esm from 'esm';
import fs from 'fs';
import bcrypt from 'bcryptjs';

import { Server } from 'socket.io';
import { createServer } from "http";


//read .env file
dotenv.config();
// disable TLS for testing mail SMTP
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
//set time zone
process.env.TZ = 'America/Toronto';



// set current working directory
const __dirname = path.resolve();
// public image directory
const CDN_DIR = path.join(__dirname, 'public');
// set website address
const SITE = 'https://staging.2kfusion.com';
// set port, listen for requests
const PORT = process.env.PORT || 3500;
//socket io listening port
const SOCKET_PORT = 8000



//database connection info
var connection;
const connectionInfo = {
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};



//secret keys declaration, to be fetched from DB
let OTP_SECRET_KEY = null;
//JWT token generation secret keys
let JWT_ACCESS_SECRET_KEY = null;
let JWT_REFRESH_SECRET_KEY = null;

let AWS_SNS_ACCESS_KEY_ID = null; 
let AWS_SECRET_ACCESS_KEY = null;
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
        fileSize: 1024 * 1024 * 2 // 2 MB
    },
    abortOnLimit: true
 }));

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}.`)
});



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
            JWT_ACCESS_SECRET_KEY = result[3].key_value;
            JWT_REFRESH_SECRET_KEY = result[4].key_value;
            console.log('initialising keys... ');
        })
    }
})



//socket io setup
//need to create httpserver to listen in order to appease cors policies
const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
})

//listen for socket
io.listen(SOCKET_PORT);

io.on('connection', (socket) => {
    console.log('socket client has connected...');

    socket.on('disconnect', (reason) => {
        console.log('socket client has disconnected...', reason);
    });
});

/********************************************************************************************************
 * 
 * 
 * 
 * HANDLING OTP LOGIN
 * 
 * 
 * 
********************************************************************************************************/


// generate OTP hash
// uses user email as unique identifier to generate a hash and otp
function newHashOTP(user, otp){
    
    const ttl      = 30 * 60 * 1000; //30 Minutes in miliseconds
    const expires  = Date.now() + ttl; //timestamp to 30 minutes in the future
    const data     = `${user}.${otp}.${expires}`; // phone.otp.expiry_timestamp
    const hash     = crypto.createHmac("sha256",OTP_SECRET_KEY).update(data).digest("hex"); // creating SHA256 hash of the data
    const fullHash = `${hash}.${expires}`; // Hash.expires, format to send to the user

    return fullHash;
}

// verify OTP hash
// uses supplied email and otp to generate a matching hash with the supplied hash to see if it matches.
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


//generate new otp from given email then sends otp to email, sends back generated hash
//requester must extract otp from sent mail, and send in otp to verify matching hash
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
});


//check if email is in DB so user can login
app.post('/api/login/verify', (req, res) => {

        const email = req.body.email;
        const hash = req.body.hash;
        const otp = req.body.otp;

        var accessToken;
        var userId;
        var userInfo;

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


                //if email is found, user exists, issue token to remember user
                if(result.length > 0) {
                    //save user id from last request to update user with token
                    userId = result[0].user_id
                    //save user info so we can send it back later on
                    userInfo = result[0];

                    //issue new jwt for this email
                    //expiry of 30 days
                    accessToken = jwt.sign({ accessEmail: email }, JWT_ACCESS_SECRET_KEY, { expiresIn: '30d' });
                    console.log('found user, signing new jwt token...')

                    //then we record token in database so we can authenticate the user later on
                    const jwtUserRequest = "UPDATE osd_users SET user_token=? WHERE user_id=?;";
                    connection.query(jwtUserRequest, [accessToken, userId], (err, result) => {
                        if(err) {
                            res.status(400).send(err);
                            return;
                        }
                        console.log('recording new jwt for user...');

                        //finally we can reply that user is verified and authenticated,
                        //send back all user info and new access token that will auth the user for 30 days
                        res.json({status: 1, verify: 1, accessToken:accessToken, userInfo: userInfo});

                    })
                    
                }
                //if no email is found 
                if(result.length === 0) {
                    //new user, so email is not yet registered in DB
                    //we will not issue an auth jwt token, because user has not placed and order before,
                    //so still an uncertain user not recorded in DB
                    //we will instead use the OTP hash with a lower expiry time of 30 mins
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


//jwt authentication verification
app.post('/api/login/jwt/auth', (req, res) => {

    //user authentication object
    const userAuth = req.body.userAuth;

    //check auth type is jwt
    if(userAuth.accessType === 'jwt') {

        //get email and token from info
        const accessEmail = userAuth.accessEmail;
        const accessToken = userAuth.accessToken;

        console.log('checking user auth...');

        jwt.verify(accessToken, JWT_ACCESS_SECRET_KEY, (err, user) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            if(user.accessEmail === accessEmail) {
            //decoded email is same as provided email
                //user is authenticated
                console.log('user is authenticated...');

                //search for email in DB
                const userInfoRequest = "SELECT * FROM osd_users WHERE user_email=?;";
                connection.query(userInfoRequest, [accessEmail], (err, result) => {
                    if(err) {
                        res.status(400).send(err);
                        return;
                    }
                    console.log('getting user info with email...');
                    res.json({status:1, userInfo: result[0]})
                })
                

            } else {
            //decoded email does not match
                //user is not authenticated
                console.log('user is not authenticated...');
                res.json({status:0})

            }
        })

    } else { 
    //not a valid request
        console.log('invalid request...');
        res.json({status:0})

    }


});


//otp authentication verification
app.post('/api/login/otp/auth', (req, res) => {

    //user authentication object
    const userAuth = req.body.userAuth;

    //check auth type is otp
    if(userAuth.accessType === 'otp') {

        //get email, token and OTP from info
        const accessEmail = userAuth.accessEmail;
        const accessToken = userAuth.accessToken;
        const accessOtp = userAuth.accessOtp;

        console.log('checking user auth...');

        console.log('verify otp... '+accessToken);
        const verify = verifyHashOTP(accessEmail,accessToken,accessOtp);

        if(verify) {
        //otp is verified, send go ahead
            res.json({status:1})

        } else {
        //otp not verified
            res.json({status:0})
        }

    } else { 
    //not a valid request
        console.log('invalid request...');
        res.json({status:0})

    }


});


/********************************************************************************************************
 * 
 * 
 * 
 * STORE DETAILS
 * 
 * 
 * 
********************************************************************************************************/





//search for store detail in DB
app.post('/api/store/detail', (req, res) => {

    
    const query = "SELECT * FROM osd_stores;";
    connection.query(query, (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        res.send(result);
        console.log('fetching store details...');
    })

});



//get delivery zones
app.post('/api/store/zones', (req, res) => {

    
    const query = "SELECT * FROM osd_delivery_zones;";
    connection.query(query, (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        res.send(result);
        console.log('fetching store delivery zones...');
    })

});


/********************************************************************************************************
 * 
 * 
 * 
 * HANDLING TIME GROUPS
 * 
 * 
 * 
********************************************************************************************************/



//fetch open and closing times from timegroups
app.post('/api/timegroup/hours/operation', (req, res) => {

    const day = req.body.day;



    const request =   "SELECT osd_timegroups.timegroup_from, osd_timegroups.timegroup_to FROM osd_timegroups INNER JOIN osd_timegroup_days ON osd_timegroups.timegroup_id = osd_timegroup_days.timegroup_id WHERE osd_timegroup_days.timegroup_day=?;";
    connection.query(request, [day], (err, result) => {

        if(err) {
            res.status(400).send(err);
            return;
        }

        
        res.send(result)
        console.log('fetching hours of operation...');

    })

});


/********************************************************************************************************
 * 
 * 
 * 
 * HANDLING CATEGORIES
 * 
 * 
 * 
********************************************************************************************************/


//fetch categories given a weekday and a time
//used to list all categories that belong in open and close times
app.post('/api/category/list/operation', (req, res) => {

    const day = req.body.day;
    const time = req.body.time;


    const request =   "SELECT osd_product_categories.category_id, category_name FROM osd_timegroups INNER JOIN osd_timegroup_days ON osd_timegroups.timegroup_id = osd_timegroup_days.timegroup_id INNER JOIN osd_timegroup_categories ON osd_timegroups.timegroup_id = osd_timegroup_categories.timegroup_id INNER JOIN osd_product_categories ON osd_timegroup_categories.category_id = osd_product_categories.category_id WHERE osd_timegroup_days.timegroup_day=? AND osd_product_categories.enabled=1 AND STR_TO_DATE(?, '%H:%i') BETWEEN osd_timegroups.timegroup_from AND osd_timegroups.timegroup_to ORDER BY osd_product_categories.order_index;";
    connection.query(request, [day, time], (err, result) => {

        if(err) {
            res.status(400).send(err);
            return;
        }

        res.send(result)
        console.log('fetching categories in hours of operation...');

    })

});



/********************************************************************************************************
 * 
 * 
 * 
 * HANDLING PRODUCTS
 * 
 * 
 * 
********************************************************************************************************/



//fetch products given a list of category ids
//used to list all products from given categories
app.post('/api/product/list/category', async (req, res) => {

    const categories = req.body.categories;

    if(categories.length === 0) {
        res.json([])
    }

    buildRequest()
    .then((result) => {
        const request = result
        connection.query(request, (err, result) => {

            if(err) {
                res.status(400).send(err);
                return;
            }

            res.send(result)
            console.log('fetching products in categories...');

        })
    })


    //helper function to build sql requests with multiple recursive values
    async function buildRequest() {
        let result = "SELECT category_id, product_id, product_name, product_desc, product_image, product_price FROM osd_products WHERE category_id IN ("
        for(let i=0;i<categories.length;i++) {

            if(i+1 === categories.length) {
                result += categories[i]+");"
                break;
            }

            result += categories[i]+","
            
        }
        return result;
    }
});




//fetch product option groups given a product id
//used to list all product option groups from given product
app.post('/api/product/list/optiongroups', (req, res) => {

    const id = req.body.id;


    const request =   "SELECT osd_optgroups.optgroup_id, optgroup_name, required, max_choices FROM osd_optgroups INNER JOIN osd_optgroup_products ON osd_optgroups.optgroup_id = osd_optgroup_products.optgroup_id WHERE product_id=?;";
    connection.query(request, [id], (err, result) => {

        if(err) {
            res.status(400).send(err);
            return;
        }

        res.send(result)
        console.log('fetching product option groups...', id);

    })

});




//fetch product options given a list of optiongroup ids
//used to list all product options from given optiongroups
app.post('/api/product/list/options', async (req, res) => {

    const optiongroups = req.body.optiongroups;

    if(optiongroups.length === 0) {
        res.json([])
    }

    buildRequest()
    .then((result) => {
        const request = result
        connection.query(request, (err, result) => {

            if(err) {
                res.status(400).send(err);
                return;
            }

            res.send(result)
            console.log('fetching options in option groups...');

        })
    })


    //helper function to build sql requests with multiple recursive values
    async function buildRequest() {
        let result = "SELECT option_id, optgroup_id, option_name, option_price FROM osd_options WHERE optgroup_id IN ("
        for(let i=0;i<optiongroups.length;i++) {

            if(i+1 === optiongroups.length) {
                result += optiongroups[i]+");"
                break;
            }

            result += optiongroups[i]+","
            
        }
        return result;
    }
});






/********************************************************************************************************
 * 
 * 
 * 
 * HANDLING ORDERS
 * 
 * 
 * 
********************************************************************************************************/






//place a paid pickup order
app.post('/api/order/pickup/place', (req, res) => {


    const paymentAuthId = req.body.paymentAuthId;
    const paymentDate = req.body.paymentDate;
    const paymentSource = req.body.paymentSource;
    const paymentStatus = req.body.paymentStatus;

    const cart = req.body.cart;
    const cartSubtotal = req.body.cartSubtotal;
    const cartTip = req.body.cartTip;
    const cartGst = req.body.cartGst;
    const cartQst = req.body.cartQst;
    const cartTotal = req.body.cartTotal;

    const orderType = req.body.orderType;
    const orderDate = req.body.orderDate;
    const orderTime = req.body.orderTime;
    const orderNote = req.body.orderNote;

    const userFirstName = req.body.userFirstName;
    const userLastName = req.body.userLastName;
    const userEmail = req.body.userEmail;
    const userPhone = req.body.userPhone;

    //formatted delivery date and time for insertion
    const orderDeliveryTime = orderDate+" "+orderTime;

    //order id to be obtained on insertion
    var orderId;
    //user id to be obtained from search
    var userId;

    //first we search if the user exists
    const searchUserRequest =   "SELECT user_id FROM osd_users WHERE user_email=?;"
    connection.query(searchUserRequest, [userEmail], (err, result) => {

        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('searching if user email already exists...');


        if(result.length) {
        //user exists, so we get the user id

            //get user id from the found user
            userId = result[0].user_id;

            //now we update their info in case they changed it
            //edit user
            const editUserRequest =   "UPDATE osd_users SET user_first_name=?, user_last_name=?, user_email=?, user_phone=? WHERE user_id=?;"
            connection.query(editUserRequest, [userFirstName, userLastName, userEmail, userPhone, userId], (err, result) => {

                if(err) {
                    console.log('error...', err);
                    res.status(400).send(err);
                    return false;
                }

                console.log('user found, updating user information...');

                //we now have the user id, we can start inserting the order
                //insert new pickup order
                const newOrderRequest =   "INSERT INTO osd_orders (order_status, order_type, order_note, order_delivery_time, order_subtotal, order_tip, order_gst, order_qst, order_total, user_id) VALUES ('NEW', 'PICKUP', ?, STR_TO_DATE(?, '%Y-%m-%d %H:%i'), ?, ?, ?, ?, ?, ?);";
                connection.query(newOrderRequest, [orderNote, orderDeliveryTime, cartSubtotal, cartTip, cartGst, cartQst, cartTotal, userId], (err, result) => {

                    if(err) {
                        console.log('error...', err);
                        res.status(400).send(err);
                        return false;
                    }

                    console.log('placing new order...');
                    //get the new order id
                    orderId = result.insertId;


                        //record new payment
                        const NewPaymentRequest =   "INSERT INTO osd_payments (payment_auth_id, payment_source, payment_status, payment_amount, payment_currency, payment_date, order_id, user_id) VALUES (?, ?, ?, ?, 'CAD', STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s'), ?, ?);";
                        connection.query(NewPaymentRequest, [paymentAuthId, paymentSource, paymentStatus, cartTotal, paymentDate, orderId, userId], (err, result) => {

                            if(err) {
                                console.log('error...', err);
                                res.status(400).send(err);
                                return false;
                            }

                            console.log('recording new payment...');

                            //finally insert the cart into order
                            insertCart(cart, orderId)
                            .then((results) => {
                                
                                io.emit('refresh_orders');
                                res.json({status:1});
                                return true;
                                
                            })
                            

                        })


                })


            })


        } else {
        //user doesnt exist so we create a new user

            //create new user
            const newUserRequest =   "INSERT INTO osd_users (user_first_name, user_last_name, user_email, user_phone) VALUES (?,?,?,?);"
            connection.query(newUserRequest, [userFirstName, userLastName, userEmail, userPhone], (err, result) => {

                if(err) {
                    console.log('error...', err);
                    res.status(400).send(err);
                    return false;
                }

                console.log('user does not exist, creating new user...');
                //get the new user id
                userId = result.insertId;

                //we now have the user id, we can start inserting the order
                //insert new pickup order
                const newOrderRequest =   "INSERT INTO osd_orders (order_status, order_type, order_note, order_delivery_time, order_subtotal, order_tip, order_gst, order_qst, order_total, user_id) VALUES ('NEW', 'PICKUP', ?, STR_TO_DATE(?, '%Y-%m-%d %H:%i'), ?, ?, ?, ?, ?, ?);";
                connection.query(newOrderRequest, [orderNote, orderDeliveryTime, cartSubtotal, cartTip, cartGst, cartQst, cartTotal, userId], (err, result) => {

                    if(err) {
                        console.log('error...', err);
                        res.status(400).send(err);
                        return false;
                    }

                    console.log('placing new order...');
                    //get the new order id
                    orderId = result.insertId;


                        //record new payment
                        const NewPaymentRequest =   "INSERT INTO osd_payments (payment_auth_id, payment_source, payment_status, payment_amount, payment_currency, payment_date, order_id, user_id) VALUES (?, ?, ?, ?, 'CAD', STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s'), ?, ?);";
                        connection.query(NewPaymentRequest, [paymentAuthId, paymentSource, paymentStatus, cartTotal, paymentDate, orderId, userId], (err, result) => {

                            if(err) {
                                console.log('error...', err);
                                res.status(400).send(err);
                                return false;
                            }

                            console.log('recording new payment...');

                            //finally insert the cart into order
                            insertCart(cart, orderId)
                            .then((results) => {
                                
                                io.emit('refresh_orders');
                                res.json({status:1});
                                return true;
                                
                            })

                        })


                })


            })
        }
    })


    //helper function to insert cart items into the order
    async function insertCart(cart, orderId) {

        var orderInId;
        var orderInOptgroupId;


        //loop through the cart
        return Promise.all(cart.map((product) => {

            //insert each item in cart
            let insertRequest = "INSERT INTO osd_orders_in (order_id, product_id, quantity, order_in_subtotal) VALUES (?, ?, ?, ?);"
            return connection.query(insertRequest, [orderId, product.productId, product.productQty, product.productSubtotal], (err, result) => {
                if(err) {
                    console.log('error...', err);
                    res.status(400).send(err);
                    return false;
                }
                console.log('inserting new item in order...');
                

                //check if there are product options to be added
                if(product['productOptions'].length) {

                    //get last inserted order_in_id to be used for next request
                    orderInId = result.insertId;

                    //loop through the product option groups
                    return Promise.all(product['productOptions'].map((group) => {

                        //insert option group for that order_in row
                        insertRequest = "INSERT INTO osd_order_in_optgroups (order_in_id, optgroup_id) VALUES (?, ?);"
                        return connection.query(insertRequest, [orderInId, group.groupId], (err, result) => {
                            if(err) {
                                console.log('error...', err);
                                res.status(400).send(err);
                                return false;
                            }
                            console.log('inserting new option group in order...');
                            orderInOptgroupId = result.insertId;

                            //loop through the product options themselves
                            return Promise.all(group['groupOptions'].map((option) => {

                                //insert option for that optgroup row
                                insertRequest = "INSERT INTO osd_order_in_options (order_in_optgroup_id, option_id) VALUES (?, ?);"
                                return connection.query(insertRequest, [orderInOptgroupId, option.optionId], (err, result) => {
                                    if(err) {
                                        res.status(400).send(err);
                                        return;
                                    }
                                    console.log('inserting new option in order option group...');
                                    //end of promise
                                    return true;
                                })

                            }))//3rd level promise

                        })

                    }))//2nd level promise


                } else {
                //no product options to be added, so we return
                    return true;
                }

            })

        }))//1st level promise

    }


});


//place a paid delivery order
app.post('/api/order/delivery/place', (req, res) => {

    const paymentAuthId = req.body.paymentAuthId;
    const paymentDate = req.body.paymentDate;
    const paymentSource = req.body.paymentSource;
    const paymentStatus = req.body.paymentStatus;

    const cart = req.body.cart;
    const cartSubtotal = req.body.cartSubtotal;
    const cartDelivery = req.body.cartDelivery;
    const cartTip = req.body.cartTip;
    const cartQst = req.body.cartQst;
    const cartGst = req.body.cartGst;
    const cartTotal = req.body.cartTotal;

    const orderType = req.body.orderType;
    const orderDate = req.body.orderDate;
    const orderTime = req.body.orderTime;
    const orderNote = req.body.orderNote;

    const userFirstName = req.body.userFirstName;
    const userLastName = req.body.userLastName;
    const userEmail = req.body.userEmail;
    const userPhone = req.body.userPhone;
    const userAddress = req.body.userAddress;
    const userCity = req.body.userCity;
    const userDistrict = req.body.userDistrict;
    const userPostalCode = req.body.userPostalCode;
    const userLat = req.body.userLat;
    const userLng = req.body.userLng;


    //formatted delivery date and time for insertion
    const orderDeliveryTime = orderDate+" "+orderTime;

   //order id to be obtained on insertion
    var orderId;
    //user id to be obtained from search
    var userId;



    //first we search if the user exists
    const searchUserRequest =   "SELECT user_id FROM osd_users WHERE user_email=?;"
    connection.query(searchUserRequest, [userEmail], (err, result) => {

        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('searching if user email already exists...');


        if(result.length) {
        //user exists, so we get the user id

            //get user id from the found user
            userId = result[0].user_id;

            //now we update their info in case they changed it
            //edit user
            const editUserRequest =   "UPDATE osd_users SET user_first_name=?, user_last_name=?, user_email=?, user_phone=?, user_address=?, user_city=?, user_district=?, user_postal_code=?, user_lat=?, user_lng=? WHERE user_id=?;"
            connection.query(editUserRequest, [userFirstName, userLastName, userEmail, userPhone, userAddress, userCity, userDistrict, userPostalCode, userLat, userLng, userId], (err, result) => {

                if(err) {
                    console.log('error...', err);
                    res.status(400).send(err);
                    return false;
                }

                console.log('user found, updating user information...');

                //we now have the user id, we can start inserting the order
                //insert new paid delivery order
                const newOrderRequest =   "INSERT INTO osd_orders (order_status, order_type, order_note, order_address, order_city, order_district, order_postal_code, order_lat, order_lng, order_delivery_time, order_subtotal, order_delivery_fee, order_tip, order_gst, order_qst, order_total, user_id) VALUES ('NEW', 'DELIVERY', ?, ?, ?, ?, ?, ?, ?, STR_TO_DATE(?, '%Y-%m-%d %H:%i'), ?, ?, ?, ?, ?, ?, ?);";
                connection.query(newOrderRequest, [orderNote, userAddress, userCity, userDistrict, userPostalCode, userLat, userLng, orderDeliveryTime, cartSubtotal, cartDelivery, cartTip, cartGst, cartQst, cartTotal, userId], (err, result) => {

                    if(err) {
                        console.log('error...', err);
                        res.status(400).send(err);
                        return false;
                    }

                    console.log('placing new order...');
                    //get the new order id
                    orderId = result.insertId;


                        //record new payment
                        const NewPaymentRequest =   "INSERT INTO osd_payments (payment_auth_id, payment_source, payment_status, payment_amount, payment_currency, payment_date, order_id, user_id) VALUES (?, ?, ?, ?, 'CAD', STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s'), ?, ?);";
                        connection.query(NewPaymentRequest, [paymentAuthId, paymentSource, paymentStatus, cartTotal, paymentDate, orderId, userId], (err, result) => {

                            if(err) {
                                console.log('error...', err);
                                res.status(400).send(err);
                                return false;
                            }

                            console.log('recording new payment...');

                            //finally insert the cart into order
                            insertCart(cart, orderId)
                            .then((results) => {
                               
                                io.emit('refresh_orders');
                                res.json({status:1});
                                return true;
                         
                            })
                            

                        })


                })

            })


        } else {
        //user doesnt exist so we create a new user

            //create new user
            const newUserRequest =   "INSERT INTO osd_users (user_first_name, user_last_name, user_email, user_phone, user_address, user_city, user_district, user_postal_code, user_lat, user_lng) VALUES (?,?,?,?,?,?,?,?,?,?);"
            connection.query(newUserRequest, [userFirstName, userLastName, userEmail, userPhone, userAddress, userCity, userDistrict, userPostalCode, userLat, userLng], (err, result) => {

                if(err) {
                    console.log('error...', err);
                    res.status(400).send(err);
                    return false;
                }

                console.log('user does not exist, creating new user...');
                //get the new user id
                userId = result.insertId;

                //we now have the user id, we can start inserting the order
                //insert new paid delivery order
                const newOrderRequest =   "INSERT INTO osd_orders (order_status, order_type, order_note, order_address, order_city, order_district, order_postal_code, order_lat, order_lng, order_delivery_time, order_subtotal, order_delivery_fee, order_tip, order_gst, order_qst, order_total, user_id) VALUES ('NEW', 'DELIVERY', ?, ?, ?, ?, ?, ?, ?, STR_TO_DATE(?, '%Y-%m-%d %H:%i'), ?, ?, ?, ?, ?, ?, ?);";
                connection.query(newOrderRequest, [orderNote, userAddress, userCity, userDistrict, userPostalCode, userLat, userLng, orderDeliveryTime, cartSubtotal, cartDelivery, cartTip, cartGst, cartQst, cartTotal, userId], (err, result) => {

                    if(err) {
                        console.log('error...', err);
                        res.status(400).send(err);
                        return false;
                    }

                    console.log('placing new order...');
                    //get the new order id
                    orderId = result.insertId;


                        //record new payment
                        const NewPaymentRequest =   "INSERT INTO osd_payments (payment_auth_id, payment_source, payment_status, payment_amount, payment_currency, payment_date, order_id, user_id) VALUES (?, ?, ?, ?, 'CAD', STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s'), ?, ?);";
                        connection.query(NewPaymentRequest, [paymentAuthId, paymentSource, paymentStatus, cartTotal, paymentDate, orderId, userId], (err, result) => {

                            if(err) {
                                console.log('error...', err);
                                res.status(400).send(err);
                                return false;
                            }

                            console.log('recording new payment...');

                            //finally insert the cart into order
                            insertCart(cart, orderId)
                            .then((results) => {
                                
                                io.emit('refresh_orders');
                                res.json({status:1});
                                return true;
                                
                            })
                            

                        })


                })


            })
        }
    })


    //helper function to insert cart items into the order
    async function insertCart(cart, orderId) {

        var orderInId;
        var orderInOptgroupId;


        //loop through the cart
        return Promise.all(cart.map((product) => {

            //insert each item in cart
            let insertRequest = "INSERT INTO osd_orders_in (order_id, product_id, quantity, order_in_subtotal) VALUES (?, ?, ?, ?);"
            return connection.query(insertRequest, [orderId, product.productId, product.productQty, product.productSubtotal], (err, result) => {
                if(err) {
                    console.log('error...', err);
                    res.status(400).send(err);
                    return false;
                }
                console.log('inserting new item in order...');
                

                //check if there are product options to be added
                if(product['productOptions'].length) {

                    //get last inserted order_in_id to be used for next request
                    orderInId = result.insertId;

                    //loop through the product option groups
                    return Promise.all(product['productOptions'].map((group) => {


                        //insert option group for that order_in row
                        insertRequest = "INSERT INTO osd_order_in_optgroups (order_in_id, optgroup_id) VALUES (?, ?);"
                        return connection.query(insertRequest, [orderInId, group.groupId], (err, result) => {
                            if(err) {
                                console.log('error...', err);
                                res.status(400).send(err);
                                return false;
                            }
                            console.log('inserting new option group in order...');
                            orderInOptgroupId = result.insertId;

                            //loop through the product options themselves
                            return Promise.all(group['groupOptions'].map((option) => {

                                //insert option for that optgroup row
                                insertRequest = "INSERT INTO osd_order_in_options (order_in_optgroup_id, option_id) VALUES (?, ?);"
                                return connection.query(insertRequest, [orderInOptgroupId, option.optionId], (err, result) => {
                                    if(err) {
                                        console.log('error...', err);
                                        res.status(400).send(err);
                                        return false;
                                    }
                                    console.log('inserting new option in order option group...');
                                    //end of promise
                                    return true;
                                })

                            }))//3rd level promise

                        })

                    }))//2nd level promise


                } else {
                    return true;
                }

            })

        }))//1st level promise

    }

});




/********************************************************************************************************
 ********************************************************************************************************
 ********************************************************************************************************
 ********************************************************************************************************
 ********************************************************************************************************
 ********************************************************************************************************
 ********************************************************************************************************
 * 
 * *************** ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN **************
 * 
 ********************************************************************************************************
 ********************************************************************************************************
 ********************************************************************************************************
 ********************************************************************************************************
 ********************************************************************************************************
 ********************************************************************************************************
 ********************************************************************************************************
********************************************************************************************************/


/********************************************************************************************************
 * 
 * 
 * 
 * HANDLING ORDERS
 * 
 * 
 * 
********************************************************************************************************/





//fetch today's orders ordered by delivery time
app.post('/api/admin/order/list/today', (req, res) => {

    const fetchOrderRequest = "SELECT u.user_id, u.user_first_name, u.user_last_name, u.user_email, u.user_phone, o.order_address, o.order_city, o.order_district, o.order_postal_code, o.order_lat, o.order_lng, o.order_id, o.order_status, o.order_type, o.order_delivery_time, o.order_subtotal, o.order_delivery_fee, o.order_tip, o.order_gst, o.order_qst, o.order_total, p.payment_auth_id, p.payment_source, p.payment_status, p.payment_date FROM osd_orders o INNER JOIN osd_payments p ON p.order_id = o.order_id INNER JOIN osd_users u ON u.user_id = o.user_id WHERE DATE(order_delivery_time)=CURDATE() ORDER BY order_delivery_time ASC;";
    connection.query(fetchOrderRequest, (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }

        console.log('fetching today\'s orders...')
        res.send(result);
    })
})

//Fetch selected order content
app.post('/api/admin/order/fetch/selected', (req, res) => {

    //current order id to be queried
    let orderId = req.body.orderId
    //fetch all items in the order
    const fetchOrderRequest = "SELECT o.order_in_id, o.order_id, p.product_id, p.product_name, p.product_price, o.quantity, o.order_in_subtotal FROM osd_orders_in o INNER JOIN osd_products p ON p.product_id = o.product_id WHERE order_id=?;"
    connection.query(fetchOrderRequest, [orderId], (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('fetching selected order... '+orderId);
        
        //start a new promise.all to await the map loop through each order row
        let promise = Promise.all(result.map((row, index) => {

            //promise wrapper to await for mysql query
            //for each row in the order we need to query the DB for product options that were added for that row
            return new Promise((resolve, reject) => {

                //fetch all order options given an order row id
                let fetchOptionsRequest = "SELECT osd_order_in_options.order_in_option_id, osd_optgroups.optgroup_id, osd_optgroups.optgroup_name, osd_options.option_id, osd_options.option_name, osd_options.option_price FROM osd_orders_in INNER JOIN osd_order_in_optgroups ON osd_order_in_optgroups.order_in_id = osd_orders_in.order_in_id INNER JOIN osd_optgroups ON osd_optgroups.optgroup_id = osd_order_in_optgroups.optgroup_id INNER JOIN osd_order_in_options ON osd_order_in_options.order_in_optgroup_id = osd_order_in_optgroups.order_in_optgroup_id INNER JOIN osd_options ON osd_options.option_id = osd_order_in_options.option_id WHERE osd_orders_in.order_in_id=?;";
                connection.query(fetchOptionsRequest, [row.order_in_id], (err, result) => {
                    if(err) {
                        console.log('error...', err);
                        res.status(400).send(err);
                        return false;
                    }

                    //if we find products options related to that order row
                    if(result.length) {

                        //resolve the promise by building the row object for this order row
                        //we use the helper options builder function
                        //to rebuild the options we received from DB into the productOptions array
                        return buildOptions(result).then((productOptions) => {
                            resolve({   
                                rowId: row.order_in_id,
                                productId: row.product_id,
                                productName: row.product_name,
                                productPrice: row.product_price,
                                productQty: row.quantity,
                                productSubtotal: row.order_in_subtotal,
                                productOptions: productOptions

                            })
                        })

                    }
                    //we didnt find any product options for this order row,
                    //we resolve a row object with an empty productOptions array for this promise
                    resolve({   
                        rowId: row.order_in_id,
                        productId: row.product_id,
                        productName: row.product_name,
                        productPrice: row.product_price,
                        productQty: row.quantity,
                        productSubtotal: row.order_in_subtotal,
                        productOptions: []

                    })

                })//connection.query

            })//Promise

            
        }))
        .then((order) => res.send(order))

        
    })

    //helper async function to build productOptions array from the results we receive from DB
    async function buildOptions(data) {

        //initial empty product options array
        let productOptions = []

        //loop through each row of data from DB
        for(let row of data){

            //build option object with a group to be inserted into productOptions array
            let optionObject = {

                groupId: row.optgroup_id,
                groupName: row.optgroup_name,
                groupOptions: [{
                                optionId: row.option_id,
                                optionName: row.option_name,
                                optionPrice: row.option_price
                            }]
            };

            //if the productOptions array is empty then we just push the option object into it
            if(!productOptions.length) {

                productOptions.push(optionObject);

            } else {
            //if the productOptions array is not empty then
            //we loop through each group object in the array to see if the group for the current row already exists

                //inital found flag
                let found = false;

                //loop through each group object
                for(let group of productOptions) {

                    //if we find a matching row group id and object group id in array
                    if(row.optgroup_id === group.groupId) {
                    //group already exists in selected options, so we push the option into the group instead
                        let currentOption = {

                            optionId: row.option_id,
                            optionName: row.option_name,
                            optionPrice: row.option_price

                        }
                        group['groupOptions'].push(currentOption);
                        //set found flag to be true
                        found = true;
                    }

                }//for group of productOptions


                if(found === false) {
                //matching group object doesnt exist in the array yet, so we push in the whole option object with group into the array
                    productOptions.push(optionObject);
                }

            }//if else

        }//for row of data

        //return the populated productOptions
        return productOptions;

    }//function

})


//move order to next status
app.post('/api/admin/order/status/next', (req, res) => {

    //get current order status and order id;
    const status = req.body.status;
    const orderId = req.body.orderId;


    const statusFlow = ['ABORTED', 'NEW', 'PROCESSING', 'READY', 'COMPLETED'];

    const currentStatus = statusFlow.findIndex((el) => el === status);
    const nextStatus = statusFlow[currentStatus+1];


    const nextStatusRequest = "UPDATE osd_orders SET order_status=? WHERE order_id=?;";
    connection.query(nextStatusRequest, [nextStatus, orderId], (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        
        io.emit('refresh_orders');
        res.send({status:1})

    })


})


/********************************************************************************************************
 * 
 * 
 * 
 * HANDLING CATEGORIES
 * 
 * 
 * 
********************************************************************************************************/



//fetch all categories
app.post('/api/admin/categories/fetch/all', (req, res) => {


    const fetchCategoriesRequest = "SELECT * FROM osd_product_categories ORDER BY order_index;";
    connection.query(fetchCategoriesRequest, (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('fetching all categories...')
        res.send(result)

    })


})


//add a new category
app.post('/api/admin/categories/insert', (req, res) => {


    const editName = req.body.editName

    const insertCategoryRequest = "INSERT INTO osd_product_categories (category_name) VALUES (?);"
    connection.query(insertCategoryRequest, [editName], (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('inserting category...', editName)


        const fetchRequest = "SELECT * FROM osd_product_categories ORDER BY order_index;";
        connection.query(fetchRequest, (err, result) => {
            if(err) {
                console.log('error...', err);
                res.status(400).send(err);
                return false;
            }
            console.log('fetching updated categories...');
            res.send(result);

        });

    });

});



//update a category given a category id
app.post('/api/admin/categories/update', (req, res) => {



    const editId = req.body.editId
    const editName = req.body.editName


    const updateRequest = "UPDATE osd_product_categories SET category_name=? WHERE category_id=?;"
    connection.query(updateRequest, [editName, editId], (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('updating category...', editId)

        const fetchRequest = "SELECT * FROM osd_product_categories ORDER BY order_index;";
        connection.query(fetchRequest, (err, result) => {
            if(err) {
                console.log('error...', err);
                res.status(400).send(err);
                return false;
            }
            console.log('fetching updated categories...');
            res.send(result);

        });


    });

});



//delete a category given a category id
app.post('/api/admin/categories/delete', (req, res) => {

    const editId = req.body.editId    

    const deleteRequest = "DELETE FROM osd_product_categories WHERE category_id=?;"
    connection.query(deleteRequest, [editId], (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('deleting category...', editId)

        const fetchRequest = "SELECT * FROM osd_product_categories ORDER BY order_index;";
        connection.query(fetchRequest, (err, result) => {
            if(err) {
                console.log('error...', err);
                res.status(400).send(err);
                return false;
            }
            console.log('fetching updated categories...');
            res.send(result);

        });


    });

});


//move category up or down one index
app.post('/api/admin/categories/move', (req, res) => {


    const sId = req.body.sId;
    const orderId = req.body.orderId;
    const nextRowId = req.body.nextRowId;
    const nextRowOrderId = req.body.nextRowOrderId;


    let moveRequest = "UPDATE osd_product_categories SET order_index=? WHERE category_id=?;"
    connection.query(moveRequest, [orderId, nextRowId], (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('set next category order index...', nextRowId,' with', orderId)

        moveRequest = "UPDATE osd_product_categories SET order_index=? WHERE category_id=?;"
        connection.query(moveRequest, [nextRowOrderId, sId], (err, result) => {
            if(err) {
                console.log('error...', err);
                res.status(400).send(err);
                return false;
            }
            console.log('set current category order index...', sId,'with', nextRowOrderId)

            const fetchRequest = "SELECT * FROM osd_product_categories ORDER BY order_index;";
            connection.query(fetchRequest, (err, result) => {
                if(err) {
                    console.log('error...', err);
                    res.status(400).send(err);
                    return false;
                }
                console.log('fetching updated categories...');
                res.send(result);


            });


        })


    })

})


/********************************************************************************************************
 * 
 * 
 * 
 * HANDLING PRODUCT OPTIONS
 * 
 * 
 * 
********************************************************************************************************/



//fetch all product options
app.post('/api/admin/options/fetch/all', (req, res) => {


    const fetchOptionsRequest = "SELECT * FROM osd_options;";
    connection.query(fetchOptionsRequest, (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('fetching all options...')
        res.send(result)

    })


})


//fetch all product options belonging to a given option group id
app.post('/api/admin/options/fetch/optiongroup', (req, res) => {

    const sId = req.body.sId

    const fetchOptionsRequest = "SELECT * FROM osd_options WHERE optgroup_id=?;";
    connection.query(fetchOptionsRequest, [sId], (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('fetching all options from option group...', sId)
        res.send(result)

    })


})


//update an option given a option id
app.post('/api/admin/options/update', (req, res) => {


    const editId = req.body.editId
    const optionEditId = req.body.optionEditId
    const optionEditName = req.body.optionEditName
    const optionEditPrice = req.body.optionEditPrice


    const updateRequest = "UPDATE osd_options SET option_name=?, option_price=? WHERE option_id=?;"
    connection.query(updateRequest, [optionEditName, optionEditPrice, optionEditId], (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('updating option...', optionEditId)

        const fetchRequest = "SELECT * FROM osd_options WHERE optgroup_id=?;";
        connection.query(fetchRequest, [editId], (err, result) => {
            if(err) {
                console.log('error...', err);
                res.status(400).send(err);
                return false;
            }
            console.log('fetching updated options from option group...', editId);
            res.send(result);

        });


    });

});


//delete an option given a option id
app.post('/api/admin/options/insert', (req, res) => {

    const editId = req.body.editId
    const optionEditName = req.body.optionEditName
    const optionEditPrice = req.body.optionEditPrice

    const insertRequest = "INSERT INTO osd_options (option_name, option_price, optgroup_id) VALUES(?, ?, ?);"
    connection.query(insertRequest, [optionEditName, optionEditPrice, editId], (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('inserting option...', optionEditName)

        const fetchRequest = "SELECT * FROM osd_options WHERE optgroup_id=?;";
        connection.query(fetchRequest, [editId], (err, result) => {
            if(err) {
                console.log('error...', err);
                res.status(400).send(err);
                return false;
            }
            console.log('fetching updated options from option group...', editId);
            res.send(result);

        });


    });

});


//insert an option
app.post('/api/admin/options/delete', (req, res) => {

    const editId = req.body.editId 
    const optionEditId = req.body.optionEditId
   

    const deleteRequest = "DELETE FROM osd_options WHERE option_id=?;"
    connection.query(deleteRequest, [optionEditId], (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('deleting option...', optionEditId)

        const fetchRequest = "SELECT * FROM osd_options WHERE optgroup_id=?;";
        connection.query(fetchRequest, [editId], (err, result) => {
            if(err) {
                console.log('error...', err);
                res.status(400).send(err);
                return false;
            }
            console.log('fetching updated options from option group...', editId);
            res.send(result);

        });


    });

});

/********************************************************************************************************
 * 
 * 
 * 
 * HANDLING PRODUCT OPTION GROUPS
 * 
 * 
 * 
********************************************************************************************************/




//fetch all product option groups
app.post('/api/admin/optiongroups/fetch/all', (req, res) => {


    const fetchOptionsgroupsRequest = "SELECT * FROM osd_optgroups;";
    connection.query(fetchOptionsgroupsRequest, (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('fetching all optiongroups...')
        res.send(result)

    })


})

//insert an option group
app.post('/api/admin/optiongroups/insert', (req, res) => {

    const editName = req.body.editName
    const editRequired = req.body.editRequired
    const editMaxChoices = req.body.editMaxChoices

    const insertOptiongroupRequest = "INSERT INTO osd_optgroups (optgroup_name, required, max_choices) VALUES (?, ?, ?);";
    connection.query(insertOptiongroupRequest, [editName, editRequired, editMaxChoices], (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('inserting optiongroup...')

        const fetchOptionsgroupsRequest = "SELECT * FROM osd_optgroups;";
        connection.query(fetchOptionsgroupsRequest, (err, result) => {
            if(err) {
                console.log('error...', err);
                res.status(400).send(err);
                return false;
            }
            console.log('fetching all optiongroups...')
            res.send(result)

        })


    })


})


//update an option group given a option group id
app.post('/api/admin/optiongroups/update', (req, res) => {


    const editId = req.body.editId
    const editName = req.body.editName
    const editRequired = req.body.editRequired
    const editMaxChoices = req.body.editMaxChoices
    const isIncluded = req.body.isIncluded


    const updateRequest = "UPDATE osd_optgroups SET optgroup_name=?, required=?, max_choices=? WHERE optgroup_id=?;"
    connection.query(updateRequest, [editName, editRequired, editMaxChoices, editId], (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('updating option group...', editId)


        if(isIncluded) {


            const updateOptionsRequest = "UPDATE osd_options SET option_price=0 WHERE optgroup_id=?;"
            connection.query(updateOptionsRequest, [editId], (err, result) => {
                if(err) {
                    console.log('error...', err);
                    res.status(400).send(err);
                    return false;
                }
                console.log('updating associated option prices...', editId)


                const fetchRequest = "SELECT * FROM osd_optgroups;";
                connection.query(fetchRequest, [editId], (err, result) => {
                    if(err) {
                        console.log('error...', err);
                        res.status(400).send(err);
                        return false;
                    }
                    console.log('fetching updated option groups...');
                    res.send(result);

                });


            })


        } else {



            const fetchRequest = "SELECT * FROM osd_optgroups;";
            connection.query(fetchRequest, (err, result) => {
                if(err) {
                    console.log('error...', err);
                    res.status(400).send(err);
                    return false;
                }
                console.log('fetching updated option groups...');
                res.send(result);

            });


        }

        

    });

});


//delete an option group given a option group id
app.post('/api/admin/optiongroups/delete', (req, res) => {


    const editId = req.body.editId

    const deleteRequest = "DELETE FROM osd_optgroups WHERE optgroup_id=?;"
    connection.query(deleteRequest, [editId], (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('deleting option group...', editId)



        const deleteRequest1 = "DELETE FROM osd_options WHERE optgroup_id=?;"
        connection.query(deleteRequest1, [editId], (err, result) => {
            if(err) {
                console.log('error...', err);
                res.status(400).send(err);
                return false;
            }
            console.log('deleting associated options...', editId)



            const deleteRequest2 = "DELETE FROM osd_optgroup_products WHERE optgroup_id=?;"
            connection.query(deleteRequest2, [editId], (err, result) => {
                if(err) {
                    console.log('error...', err);
                    res.status(400).send(err);
                    return false;
                }
                console.log('deleting associated option group products...', editId)


                const fetchRequest = "SELECT * FROM osd_optgroups;";
                connection.query(fetchRequest, (err, result) => {
                    if(err) {
                        console.log('error...', err);
                        res.status(400).send(err);
                        return false;
                    }
                    console.log('fetching updated option groups...');
                    res.send(result);

                });

            });

        });

    });

});



/********************************************************************************************************
 * 
 * 
 * 
 * HANDLING PRODUCTS
 * 
 * 
 * 
********************************************************************************************************/



//fetch all products in given category
app.post('/api/admin/products/fetch/category', (req, res) => {

    const categoryId = req.body.categoryId

    const fetchProductsRequest = "SELECT * FROM osd_products WHERE category_id=? ORDER BY order_index;";
    connection.query(fetchProductsRequest, [categoryId], (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('fetching all products from category...', categoryId)
        res.send(result)

    })


})


//add a new product
app.post('/api/admin/products/insert', (req, res) => {


    const categorySelectId = req.body.categorySelectId

    const editName = req.body.editName
    const editDesc = req.body.editDesc

    let editPrice = req.body.editPrice
    editPrice = Math.round(editPrice*100)/100

    let optiongroups = req.body.optiongroups

    var fileUrl;


    //if we uploaded a new image file
    if(req.files) {

        const file = req.files.file;

        //set upload path
        const uploadPath = CDN_DIR+'/assets/';
        const timestamp = Date.now();
        const fileExtension = (file.name).split('.').pop()
        const fileName = timestamp+'.'+fileExtension;
        const filePath = uploadPath+fileName;

        fileUrl = SITE+'/assets/'+fileName;

        //move file to directory
        file.mv(filePath, err => {

            if(err) {
                console.error(err);
                res.status(400).send(err);
            }
            console.log("uploading file..."+file.name) 

        })
    } else {
        fileUrl = "";
    }
    


    const insertProductRequest = "INSERT INTO osd_products (product_name, product_desc, product_image, product_price, category_id) VALUES (?, ?, ?, ?, ?);"
    connection.query(insertProductRequest, [editName, editDesc, fileUrl, editPrice, categorySelectId], (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('inserting product...', editName)


        //if we got option groups
        if(JSON.parse(optiongroups).length) {

            //use newly inserted product id for next request
            const lastInsertID = result.insertId;

            //decode the stringified array
            optiongroups = JSON.parse(optiongroups)

            //build the insert request
            //by looping through option groups
            let insertRequest = "INSERT INTO osd_optgroup_products (optgroup_id, product_id) VALUES "
            let promise = Promise.all(optiongroups.map((group, index) => {

                if(index+1 === optiongroups.length) {
                    return insertRequest += "("+group+","+lastInsertID+");" 
                }
                return insertRequest += "("+group+","+lastInsertID+")," 
                

            })).then((results) => {
    
                //then we insert the newly selected optiongroups
                connection.query(insertRequest, (err, result) => {
                    if(err) {
                        console.log('error...', err);
                        res.status(400).send(err);
                        return false;
                    }
                    console.log('inserting new selected option groups...')

                    //finally we fetch the updated product list
                    const fetchQuery = "SELECT * FROM osd_products WHERE category_id=? ORDER BY order_index;";
                    connection.query(fetchQuery, [categorySelectId], (err, result) => {
                        if(err) {
                            console.log('error...', err);
                            res.status(400).send(err);
                            return false;
                        }
                        console.log('fetching updated products from cateogry...', categorySelectId);
                        res.send(result);

                    });


                })

            })
        //no option groups
        } else {


            //no option groups to insert, so we just fetch the updated product list
            const fetchQuery = "SELECT * FROM osd_products WHERE category_id=? ORDER BY order_index;";
            connection.query(fetchQuery, [categorySelectId], (err, result) => {
                if(err) {
                    console.log('error...', err);
                    res.status(400).send(err);
                    return false;
                }
                console.log('fetching updated products from cateogry...', categorySelectId);
                res.send(result);

            });


        }

    })

})



//update a product given a product id
app.post('/api/admin/products/update', (req, res) => {


    const categorySelectId = req.body.categorySelectId

    const editId = req.body.editId
    const editName = req.body.editName
    const editDesc = req.body.editDesc
    
    let editPrice = req.body.editPrice
    editPrice = Math.round(editPrice*100)/100

    //current image file of product, need to delete it from server if
    //we uploaded another file to replace it
    let editImg = req.body.editImg

    let optiongroups = req.body.optiongroups


    //if we uploaded a new image file
    if(req.files) {

        const file = req.files.file;

        //set upload path
        const uploadPath = CDN_DIR+'/assets/';
        const timestamp = Date.now();
        const fileExtension = (file.name).split('.').pop()
        const fileName = timestamp+'.'+fileExtension;
        const filePath = uploadPath+fileName;

        const fileUrl = SITE+'/assets/'+fileName;

        //move file to directory
        file.mv(filePath, err => {

            if(err) {
                console.error(err);
                res.status(400).send(err);
            }
            console.log("uploading file..."+file.name) 

        })


        //delete old image file
        editImg = editImg.replace(SITE, '')
        editImg = CDN_DIR+editImg


        fs.unlink(editImg, (err) => {
            if(err) {
                console.log('error...', err);
            } else {
                console.log('deleting associated image file...', editImg)
            }
        });
        


        const updateRequest = "UPDATE osd_products SET product_name=?, product_desc=?, product_image=?, product_price=? WHERE product_id=?;"
        connection.query(updateRequest, [editName, editDesc, fileUrl, editPrice, editId], (err, result) => {
            if(err) {
                console.log('error...', err);
                res.status(400).send(err);
                return false;
            }
            console.log('updating product...', editId)

            //first delete existing option groups
            const deleteRequest = "DELETE FROM osd_optgroup_products WHERE product_id=?"
            connection.query(deleteRequest, [editId], (err, result) => {
                if(err) {
                    console.log('error...', err);
                    res.status(400).send(err);
                    return false;
                }
                console.log('deleting all optiongroups from product...', editId)


                //if we got option groups
                if(JSON.parse(optiongroups).length) {

                    //decode the stringified array
                    optiongroups = JSON.parse(optiongroups)
                    //build the insert request
                    //by looping through option groups
                    let insertRequest = "INSERT INTO osd_optgroup_products (optgroup_id, product_id) VALUES "
                    let promise = Promise.all(optiongroups.map((group, index) => {

                        if(index+1 === optiongroups.length) {
                            return insertRequest += "("+group+","+editId+");" 
                        }
                        return insertRequest += "("+group+","+editId+")," 
                        

                    })).then((results) => {
                        

                        //then we insert the newly selected optiongroups
                        connection.query(insertRequest, (err, result) => {
                            if(err) {
                                console.log('error...', err);
                                res.status(400).send(err);
                                return false;
                            }
                            console.log('inserting new selected option groups...')

                            //finally we fetch the updated product list
                            const fetchQuery = "SELECT * FROM osd_products WHERE category_id=? ORDER BY order_index;";
                            connection.query(fetchQuery, [categorySelectId], (err, result) => {
                                if(err) {
                                    console.log('error...', err);
                                    res.status(400).send(err);
                                    return false;
                                }
                                console.log('fetching updated products from cateogry...', categorySelectId);
                                res.send(result);

                            });

                        })

                    })
                //no option groups to add
                } else {


                    //no option groups to insert, so we just fetch the updated product list
                    const fetchQuery = "SELECT * FROM osd_products WHERE category_id=? ORDER BY order_index;";
                    connection.query(fetchQuery, [categorySelectId], (err, result) => {
                        if(err) {
                            console.log('error...', err);
                            res.status(400).send(err);
                            return false;
                        }
                        console.log('fetching updated products from cateogry...', categorySelectId);
                        res.send(result);

                    });

                }

            })

    })

    //if we didnt upload an image file
    } else {

        //update product with new data
        const updateRequest = "UPDATE osd_products SET product_name=?, product_desc=?, product_price=? WHERE product_id=?;"
        connection.query(updateRequest, [editName, editDesc, editPrice, editId], (err, result) => {
            if(err) {
                console.log('error...', err);
                res.status(400).send(err);
                return false;
            }
            console.log('updating product...', editId);


            //first delete existing option groups
            const deleteRequest = "DELETE FROM osd_optgroup_products WHERE product_id=?"
            connection.query(deleteRequest, [editId], (err, result) => {
                if(err) {
                    console.log('error...', err);
                    res.status(400).send(err);
                    return false;
                }
                console.log('deleting all optiongroups from product...', editId)


                //if we got option groups
                if(JSON.parse(optiongroups).length) {

                    //decode the stringified array
                    optiongroups = JSON.parse(optiongroups)

                    //build the insert request
                    //by looping through option groups
                    let insertRequest = "INSERT INTO osd_optgroup_products (optgroup_id, product_id) VALUES "
                    let promise = Promise.all(optiongroups.map((group, index) => {

                        if(index+1 === optiongroups.length) {
                            return insertRequest += "("+group+","+editId+");" 
                        }
                        return insertRequest += "("+group+","+editId+")," 
                        

                    })).then((results) => {
                        

                        //then we insert the newly selected optiongroups
                        connection.query(insertRequest, (err, result) => {
                            if(err) {
                                console.log('error...', err);
                                res.status(400).send(err);
                                return false;
                            }
                            console.log('inserting new selected option groups...')

                            //finally we fetch the updated product list
                            const fetchQuery = "SELECT * FROM osd_products WHERE category_id=? ORDER BY order_index;";
                            connection.query(fetchQuery, [categorySelectId], (err, result) => {
                                if(err) {
                                    console.log('error...', err);
                                    res.status(400).send(err);
                                    return false;
                                }
                                console.log('fetching updated products from cateogry...', categorySelectId);
                                res.send(result);

                            });

                        })

                    })
                //no option groups
                } else {


                    //no option groups to insert, so we just fetch the updated product list
                    const fetchQuery = "SELECT * FROM osd_products WHERE category_id=? ORDER BY order_index;";
                    connection.query(fetchQuery, [categorySelectId], (err, result) => {
                        if(err) {
                            console.log('error...', err);
                            res.status(400).send(err);
                            return false;
                        }
                        console.log('fetching updated products from cateogry...', categorySelectId);
                        res.send(result);

                    });


                }

            });

        })

    }

})



//delete a product given a product id
app.post('/api/admin/products/delete', async (req, res) => {

    const categorySelectId = req.body.categorySelectId
    const editId = req.body.editId    


    let editImg = req.body.editImg;
    editImg = editImg.replace(SITE, '')
    editImg = CDN_DIR+editImg


    fs.unlink(editImg, (err) => {
        if(err) {
            console.log('error...', err);
        } else {
            console.log('deleting associated image file...', editImg)
        }
    });


    const deleteRequest = "DELETE FROM osd_products WHERE product_id=?;"
    connection.query(deleteRequest, [editId], (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('deleting product...', editId)



        const deleteRequest1 = "DELETE FROM osd_optgroup_products WHERE product_id=?;"
        connection.query(deleteRequest1, [editId], (err, result) => {
            if(err) {
                console.log('error...', err);
                res.status(400).send(err);
                return false;
            }

            console.log('deleting associated optiongroups to product...', editId)


            const fetchRequest = "SELECT * FROM osd_products WHERE category_id=? ORDER BY order_index;";
            connection.query(fetchRequest, [categorySelectId], (err, result) => {
                if(err) {
                    console.log('error...', err);
                    res.status(400).send(err);
                    return false;
                }
                console.log('fetching updated products...');
                res.send(result);

            });


        })

    });

});


//move product up or down one index
app.post('/api/admin/products/move', (req, res) => {


    const categorySelectId = req.body.categorySelectId
    const sId = req.body.sId;
    const orderId = req.body.orderId;
    const nextRowId = req.body.nextRowId;
    const nextRowOrderId = req.body.nextRowOrderId;


    let moveRequest = "UPDATE osd_products SET order_index=? WHERE product_id=?;"
    connection.query(moveRequest, [orderId, nextRowId], (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('set next product order index...', nextRowId,' with', orderId)

        moveRequest = "UPDATE osd_products SET order_index=? WHERE product_id=?;"
        connection.query(moveRequest, [nextRowOrderId, sId], (err, result) => {
            if(err) {
                console.log('error...', err);
                res.status(400).send(err);
                return false;
            }
            console.log('set current product order index...', sId,'with', nextRowOrderId)

            const fetchProductsRequest = "SELECT * FROM osd_products WHERE category_id=? ORDER BY order_index;"
            connection.query(fetchProductsRequest, [categorySelectId], (err, result) => {
                if(err) {
                    console.log('error...', err);
                    res.status(400).send(err);
                    return false;
                }
                console.log('fetching updated products...')
                res.send(result)

            })


        })


    })

})





/********************************************************************************************************
 * 
 * 
 * 
 * HANDLING TIMEGROUPS
 * 
 * 
 * 
********************************************************************************************************/



//fetch all timegroups
app.post('/api/admin/timegroups/fetch/all', (req, res) => {


    const fetchTimegroupsRequest = "SELECT * FROM osd_timegroups;";
    connection.query(fetchTimegroupsRequest, (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('fetching all timegroups...')
        res.send(result)

    })


})


//fetch timegroup days given a timegroup id
app.post('/api/admin/timegroups/fetch/days', (req, res) => {

    const timegroupId = req.body.timegroupId;

    const fetchTimegroupRequest = "SELECT * FROM osd_timegroup_days WHERE timegroup_id=?;";
    connection.query(fetchTimegroupRequest, [timegroupId], (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('fetching all timegroup days from timegroup...', timegroupId)
        res.send(result)


    })

})


//fetch timegroup categories given a timegroup id
app.post('/api/admin/timegroups/fetch/categories', (req, res) => {

    const timegroupId = req.body.timegroupId;

    const fetchTimegroupRequest = "SELECT * FROM osd_timegroup_categories WHERE timegroup_id=?;";
    connection.query(fetchTimegroupRequest, [timegroupId], (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('fetching all timegroup categories from timegroup...', timegroupId)
        res.send(result)


    })

})


//update timegroup given a timegroup id
app.post('/api/admin/timegroups/update', (req, res) => {


    const editId = req.body.editId
    const editName = req.body.editName
    const selectDays = req.body.selectDays
    const editFrom = req.body.editFrom
    const editTo = req.body.editTo
    const selectCategories = req.body.selectCategories


    let updateRequest = "UPDATE osd_timegroups SET timegroup_name=?, timegroup_from=STR_TO_DATE(?, '%H:%i'), timegroup_to=STR_TO_DATE(?, '%H:%i') WHERE timegroup_id=?;"
    connection.query(updateRequest, [editName, editFrom, editTo, editId], (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('updating timgroup...', editId)


        let deleteDaysRequest = "DELETE FROM osd_timegroup_days WHERE timegroup_id=?"
        connection.query(deleteDaysRequest, [editId], (err, result) => {
            if(err) {
                console.log('error...', err);
                res.status(400).send(err);
                return false;
            }
            console.log('deleting timgroup days...', editId)


            let deleteCategoriesRequest = "DELETE FROM osd_timegroup_categories WHERE timegroup_id=?"
            connection.query(deleteCategoriesRequest, [editId], (err, result) => {
                if(err) {
                    console.log('error...', err);
                    res.status(400).send(err);
                    return false;
                }
                console.log('deleting timgroup categories...', editId)



                //build the insert request
                //by looping through timegroup days
                let insertDaysRequest = "INSERT INTO osd_timegroup_days (timegroup_id, timegroup_day) VALUES "
                let promise = Promise.all(selectDays.map((day, index) => {

                    if(index+1 === selectDays.length) {
                        return insertDaysRequest += "("+editId+","+day+");" 
                    }
                    return insertDaysRequest += "("+editId+","+day+")," 
                    

                })).then((results) => {

                    //then we insert the newly selected optiongroups
                    connection.query(insertDaysRequest, (err, result) => {
                        if(err) {
                            console.log('error...', err);
                            res.status(400).send(err);
                            return false;
                        }
                        console.log('inserting new selected timegroup days...')


                        //build the insert request
                        //by looping through timegroup categories
                        let insertCategoriesRequest = "INSERT INTO osd_timegroup_categories (timegroup_id, category_id) VALUES "
                        let promise1 = Promise.all(selectCategories.map((category, index) => {

                            if(index+1 === selectCategories.length) {
                                return insertCategoriesRequest += "("+editId+","+category+");" 
                            }
                            return insertCategoriesRequest += "("+editId+","+category+")," 
                            

                        })).then((results) => {

                            //then we insert the newly selected optiongroups
                            connection.query(insertCategoriesRequest, (err, result) => {
                                if(err) {
                                    console.log('error...', err);
                                    res.status(400).send(err);
                                    return false;
                                }
                                console.log('inserting new selected timegroup categories...')
                                res.send({status:1})


                            })
                        })//then promise

                    })
                })//then promise

            })

        })


    })

})




//insert a new timegroup
app.post('/api/admin/timegroups/insert', (req, res) => {


    const editName = req.body.editName
    const selectDays = req.body.selectDays
    const editFrom = req.body.editFrom
    const editTo = req.body.editTo
    const selectCategories = req.body.selectCategories


    let insertRequest = "INSERT INTO osd_timegroups (timegroup_name, timegroup_from, timegroup_to) VALUES (?, STR_TO_DATE(?, '%H:%i'), STR_TO_DATE(?, '%H:%i'));"
    connection.query(insertRequest, [editName, editFrom, editTo], (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('inserting new timgroup...', editName)

        //use newly inserted product id for next request
        const lastInsertID = result.insertId;


        //build the insert request
        //by looping through timegroup days
        let insertDaysRequest = "INSERT INTO osd_timegroup_days (timegroup_id, timegroup_day) VALUES "
        let promise = Promise.all(selectDays.map((day, index) => {

            if(index+1 === selectDays.length) {
                return insertDaysRequest += "("+lastInsertID+","+day+");" 
            }
            return insertDaysRequest += "("+lastInsertID+","+day+")," 
            

        })).then((results) => {

            //then we insert the newly selected optiongroups
            connection.query(insertDaysRequest, (err, result) => {
                if(err) {
                    console.log('error...', err);
                    res.status(400).send(err);
                    return false;
                }
                console.log('inserting new selected timegroup days...')


                //build the insert request
                //by looping through timegroup categories
                let insertCategoriesRequest = "INSERT INTO osd_timegroup_categories (timegroup_id, category_id) VALUES "
                let promise1 = Promise.all(selectCategories.map((category, index) => {

                    if(index+1 === selectCategories.length) {
                        return insertCategoriesRequest += "("+lastInsertID+","+category+");" 
                    }
                    return insertCategoriesRequest += "("+lastInsertID+","+category+")," 
                    

                })).then((results) => {

                    //then we insert the newly selected optiongroups
                    connection.query(insertCategoriesRequest, (err, result) => {
                        if(err) {
                            console.log('error...', err);
                            res.status(400).send(err);
                            return false;
                        }
                        console.log('inserting new selected timegroup categories...')
                        res.send({status:1})


                    })
                })//then promise

            })
        })//then promise


    })

})




//delete timegroup given a timegroup id
app.post('/api/admin/timegroups/delete', (req, res) => {

    const editId = req.body.editId

    let deleteRequest = "DELETE FROM osd_timegroups WHERE timegroup_id=?"
    connection.query(deleteRequest, [editId], (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('deleting timgroup...', editId)


        let deleteDaysRequest = "DELETE FROM osd_timegroup_days WHERE timegroup_id=?"
        connection.query(deleteDaysRequest, [editId], (err, result) => {
            if(err) {
                console.log('error...', err);
                res.status(400).send(err);
                return false;
            }
            console.log('deleting timgroup days...', editId)


            let deleteCategoriesRequest = "DELETE FROM osd_timegroup_categories WHERE timegroup_id=?"
            connection.query(deleteCategoriesRequest, [editId], (err, result) => {
                if(err) {
                    console.log('error...', err);
                    res.status(400).send(err);
                    return false;
                }
                console.log('deleting timgroup categories...', editId)
                res.send({status:1})


            })


        })

    })

})



/********************************************************************************************************
 * 
 * 
 * 
 * HANDLING DELIVERY ZONES
 * 
 * 
 * 
********************************************************************************************************/



//fetch all delivery zones
app.post('/api/admin/deliveryzones/fetch/all', (req, res) => {


    const fetchZonesRequest = "SELECT * FROM osd_delivery_zones ORDER BY delivery_zone_range;";
    connection.query(fetchZonesRequest, (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('fetching all delivery zones...')
        res.send(result)

    })


})


//update a delivery zone given a zone id
app.post('/api/admin/deliveryzones/update', (req, res) => {

    const zoneSelectId = req.body.zoneSelectId;
    const editPrice = req.body.editPrice;
    const editMinimum = req.body.editMinimum;
    const editRange = req.body.editRange;


    const updateZonesRequest = "UPDATE osd_delivery_zones SET delivery_zone_range=?, delivery_zone_price=?, delivery_zone_order_min=? WHERE delivery_zone_id=?;";
    connection.query(updateZonesRequest, [editRange, editPrice, editMinimum, zoneSelectId], (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('updating delivery zone...', zoneSelectId)


        const fetchZonesRequest = "SELECT * FROM osd_delivery_zones ORDER BY delivery_zone_range;";
        connection.query(fetchZonesRequest, (err, result) => {
            if(err) {
                console.log('error...', err);
                res.status(400).send(err);
                return false;
            }
            console.log('fetching all delivery zones...')
            res.send(result)

        })


    })


})


//insert new delivery zone
app.post('/api/admin/deliveryzones/insert', (req, res) => {

    const insertZonesRequest = "INSERT INTO osd_delivery_zones (delivery_zone_range, delivery_zone_price, delivery_zone_order_min) VALUES (?, ?, ?);"
    connection.query(insertZonesRequest, [0.5,0,0], (err, result) => {
        if(err) {
                console.log('error...', err);
                res.status(400).send(err);
                return false;
            }
        console.log('inserting new delivery zone...')

        //use newly inserted product id for next request
        const lastInsertID = result.insertId;

        const fetchZonesRequest = "SELECT * FROM osd_delivery_zones ORDER BY delivery_zone_range;";
        connection.query(fetchZonesRequest, (err, result) => {
            if(err) {
                console.log('error...', err);
                res.status(400).send(err);
                return false;
            }
            console.log('fetching all delivery zones...')
            res.send({lastInsertID: lastInsertID, result: result})

        })

    })

})



//delete a delivery zone given a delivery zone id
app.post('/api/admin/deliveryzones/delete', (req, res) => {

    const zoneSelectId = req.body.zoneSelectId;

    const deleteZoneRequest = "DELETE FROM osd_delivery_zones WHERE delivery_zone_id=?;";
    connection.query(deleteZoneRequest, [zoneSelectId], (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('deleting delivery zone...', zoneSelectId)


        const fetchZonesRequest = "SELECT * FROM osd_delivery_zones ORDER BY delivery_zone_range;";
        connection.query(fetchZonesRequest, (err, result) => {
            if(err) {
                console.log('error...', err);
                res.status(400).send(err);
                return false;
            }
            console.log('fetching all delivery zones...')
            res.send(result)

        })


    })


})




/********************************************************************************************************
 * 
 * 
 * 
 * HANDLING ADMIN LOGIN
 * 
 * 
 * 
********************************************************************************************************/



//login admin user
app.post('/api/admin/login', (req, res) => {

    const username = req.body.username
    const password = req.body.password

    //first find if username exists
    const fetchUserRequest = "SELECT * FROM osd_staff WHERE staff_username=?;";
    connection.query(fetchUserRequest, [username], (err, result) => {
        if(err) {
            console.log('error...', err);
            res.status(400).send(err);
            return false;
        }
        console.log('login attempt, finding user in database...', username)

        //user exists, start comparing password
        if(result.length) {
            bcrypt.compare(password, result[0].staff_password)
            .then((match) => {

                //login successful, issue new JWT token
                if(match) {

                    console.log('login success, issuing token...')
                    const token = jwt.sign({userId: result[0].staff_id, JWT_ACCESS_SECRET_KEY})
                    res.json({status:1, token})
                    return;

                } else {

                    console.log('login failed, password invalid...')
                    res.json({status:0, reason:'password'})
                    return;

                }

            })
            .catch((err) => {
                console.log('error...', err);
                res.status(400).send(err);
                return false;
            })


        } else if(result.length === 0) {

            console.log('login failed, username not found...')
            res.json({status:0, reason:'username'})
            return;

        } else {

            console.log('login failed, multiple users found...')
            res.json({status:0, reason:'error'})
            return;

        }


    })

})




/********************************************************************************************************
 ********************************************************************************************************
 ********************************************************************************************************
 ********************************************************************************************************
 ********************************************************************************************************
 ********************************************************************************************************
 ********************************************************************************************************
 * 
 * *************** ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN **************
 * 
 ********************************************************************************************************
 ********************************************************************************************************
 ********************************************************************************************************
 ********************************************************************************************************
 ********************************************************************************************************
 ********************************************************************************************************
 ********************************************************************************************************
********************************************************************************************************/





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

app.get('/api/test', (req, res) => {

    var userId;
    const email = 'test@msmtech.ca'
    //search for email in DB
    const query = "SELECT * FROM osd_users WHERE user_email=?;";
    connection.query(query, [email], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        userId = result[0].user_id

        console.log('logging in with email...');
        console.log('userId', userId)

    })


})


app.get('/api/test/io', (req, res) => {

   io.emit('refresh_orders');
   res.send({status: 1})


})





app.get('/api/test/img', (req, res) => {

    let img = "https://staging.2kfusion.com/assets/1648600005046.JPG"
    img = img.replace(SITE, '')
    img = CDN_DIR+img
    console.log(img)


})
