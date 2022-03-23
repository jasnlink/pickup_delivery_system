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
import util from 'util';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('util.promisify').shim();


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


    const request =   "SELECT osd_product_categories.category_id, category_name FROM osd_timegroups INNER JOIN osd_timegroup_days ON osd_timegroups.timegroup_id = osd_timegroup_days.timegroup_id INNER JOIN osd_timegroup_categories ON osd_timegroups.timegroup_id = osd_timegroup_categories.timegroup_id INNER JOIN osd_product_categories ON osd_timegroup_categories.category_id = osd_product_categories.category_id WHERE osd_timegroup_days.timegroup_day=? AND osd_product_categories.enabled=1 AND STR_TO_DATE(?, '%H:%i') BETWEEN osd_timegroups.timegroup_from AND osd_timegroups.timegroup_to;";
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
        console.log('fetching product option groups...');

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
app.post('/api/order/paid/pickup/place', (req, res) => {


    const paymentAuthId = req.body.paymentAuthId;
    const paymentDate = req.body.paymentDate;
    const paymentSource = req.body.paymentSource;

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

    let userId = req.body.userId;
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

    const orderDeliveryTime = orderDate+" "+orderTime;
    var orderId;

    //record new payment
    const NewPaymentRequest =   "INSERT INTO osd_payments (payment_auth_id, payment_source, payment_status, payment_amount, payment_currency, payment_date, order_id, user_id) VALUES (?, ?, 'COMPLETED', ?, 'CAD', STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s'), ?, ?);";
    
    //insert new pickup order
    const request =   "INSERT INTO osd_orders (order_status, order_type, order_note, order_delivery_time, user_id) VALUES ('NEW', 'PICKUP', ?, STR_TO_DATE(?, '%Y-%m-%d %H:%i'), ? );";
    
    //create new user
    const request =   "INSERT INTO osd_users (user_first_name, user_last_name, user_email, user_phone) VALUES (?,?,?,?);"
    



    //first we search for user if exists
    const searchUserRequest =   "SELECT user_id FROM osd_users WHERE user_email=?;"

    connection.query(searchUserRequest, [userEmail], (err, result) => {

        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('search if user email already exists...');


        if(result.length) {
        //user exists, so we get the user id
            result[0].user_id

        } else {
        //user doesnt exist so we create a new user

            //create new user
            const newUserRequest =   "INSERT INTO osd_users (user_first_name, user_last_name, user_email, user_phone) VALUES (?,?,?,?);"
            connection.query(newUserRequest, [userFirstName, userLastName, userEmail, userPhone], (err, result) => {

                if(err) {
                    res.status(400).send(err);
                    return;
                }

                console.log('user does not exist, creating new user...');
                //get the new user id
                userId = result.insertId;

                //insert new pickup order
                const newOrderRequest =   "INSERT INTO osd_orders (order_status, order_type, order_note, order_delivery_time, order_subtotal, order_tip, order_gst, order_qst, order_total, user_id) VALUES ('NEW', 'PICKUP', ?, STR_TO_DATE(?, '%Y-%m-%d %H:%i'), ?, ?, ?, ?, ?, ?);";
                connection.query(newOrderRequest, [orderNote, orderDeliveryTime, cartSubtotal, cartTip, cartGst, cartQst, cartTotal, userId], (err, result) => {

                    if(err) {
                        res.status(400).send(err);
                        return;
                    }

                    console.log('placing new order...');
                    //get the new order id
                    orderId = result.insertId;


                        //finally record new payment
                        const NewPaymentRequest =   "INSERT INTO osd_payments (payment_auth_id, payment_source, payment_status, payment_amount, payment_currency, payment_date, order_id, user_id) VALUES (?, ?, 'COMPLETED', ?, 'CAD', STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s'), ?, ?);";
                        connection.query(NewPaymentRequest, [paymentAuthId, paymentSource, cartTotal, paymentDate, orderId, userId], (err, result) => {

                            if(err) {
                                res.status(400).send(err);
                                return;
                            }

                            console.log('recording new payment...');

                            //insert the cart
                            insertCart(cart, orderId)
                            .then((result) => {

                                res.json({status:1});
                                return;

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
        Promise.all(cart.map((product) => {

            //insert each item in cart
            let insertRequest = "INSERT INTO osd_orders_in (order_id, product_id, quantity) VALUES (?, ?, ?);"
            connection.query(insertRequest, [orderId, product.productId, productQty], (err, result) => {
                if(err) {
                    res.status(400).send(err);
                    return;
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
                        connection.query(insertRequest, [orderInId, , group.groupId], (err, result) => {
                            if(err) {
                                res.status(400).send(err);
                                return;
                            }
                            console.log('inserting new option group in order...');
                            orderInOptgroupId = result.insertId;

                            //loop through the product options themselves
                            return Promise.all(group['groupOptions'].map((option) => {

                                //insert option for that optgroup row
                                insertRequest = "INSERT INTO osd_order_in_options (order_in_optgroup_id, option_id) VALUES (?, ?);"
                                connection.query(insertRequest, [orderInOptgroupId, , option.optionId], (err, result) => {
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
                //no product options to be added, so we return success
                    return true;
                }

            })

        }))//1st level promise
        .then((result) => {
        //once all promises are done
            console.log('done!', result)
            return true;
        })

    }

});


//place a delivery order
app.post('/api/order/delivery/place', (req, res) => {

   const authId = req.body.authId;
    const date = req.body.date;
    const source = req.body.source;

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

    const userId = req.body.userId;
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

    //record new payment
    const request =   "INSERT INTO osd_payments (payment_auth_id, payment_source, payment_status, payment_amount, payment_currency, payment_date);";
    //insert new order
    const request =   "INSERT INTO osd_orders (order_status, order_type, order_note, order_delivery_time, user_id);";
    //create new user
    const request =   "INSERT INTO osd_users (user_first_name, user_last_name, user_email, user_phone, user_address, user_city, user_district, user_postal_code, user_lat, user_lng);"

    connection.query(request, [id], (err, result) => {

        if(err) {
            res.status(400).send(err);
            return;
        }

        
        res.send(result)
        console.log('fetching product option groups...');

    })


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
