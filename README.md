# MealPortal - Online Pickup, Delivery Ordering Software

## Purpose
 
Customers login with an one-time passcode via their emails and can place online food orders to the restaurant. The software recognizes the returning user by saving a JWT token after they have verified their emails so they don't have to retype their information.

New users can simply autocomplete their addresses with the Google Maps Address autocomplete.

Restaurant staff can manage orders placed through the backend. They can create, edit, reorder, and remove menu categories, products and product options. They can choose the specific times each category will be displayed at. They can decide delivery fees, order minimum and delivery distance for their orders.

## Challenges faced

I needed a way to authenticate and remember customers. I did not want users to have to create an account before they have placed an order because this interrupts the user flow and wastes system resources if the user doesn't place an order.

I opted for JSON web tokens to sign and verify authentication because it is a known secure standard. I remember the user with their email and confirm that they actually own the email with a one-time passcode system that issues time-sensitive passcodes to their email.

I needed a way to handle online payments, I decided to connect with the Paypal Payment API because it is a recognisable brand. I also opted for Stripe to handle credit card payments because credit card processing security compliance requires too much resources.

I needed a way to nofify the staff backend of new incoming orders in realtime. I decided to send the order from the frontend React app to the backend NodeJS server via a POST request. The backend server then inserts the orders and payment details to the MySQL database and then sends the order to the staff React frontend with socket.io.

### Email one-time passcode authentication

![otp system](https://msmtech.ca/wp-content/uploads/2022/04/3-6.jpg)
![otp system](https://msmtech.ca/wp-content/uploads/2022/04/4-4.jpg)

### Order time selection and Google Maps API address autocomplete.

![google maps autocomplete](https://msmtech.ca/wp-content/uploads/2022/04/6-3.jpg)
![google maps autocomplete](https://msmtech.ca/wp-content/uploads/2022/04/5-3.jpg)

### Placing an order and paying for it.

![order placement](https://msmtech.ca/wp-content/uploads/2022/04/11-2.jpg)
![order placement](https://msmtech.ca/wp-content/uploads/2022/04/13.jpg)

### Order management backend.

![order management](https://msmtech.ca/wp-content/uploads/2022/04/2-4.jpg)

### Menu customization dialog.

![menu customization](https://msmtech.ca/wp-content/uploads/2022/04/5-2.jpg)

### Menu schedule planning tool.

![menu schdeule planning](https://msmtech.ca/wp-content/uploads/2022/04/8-2.jpg)

### Restaurant delivery zone fees and distance planning tool.

![restaurant delivery planning](https://msmtech.ca/wp-content/uploads/2022/04/9.jpg)


## Technologies used
Javascript, React, Material UI, REST API, JSON web token authentication, Google Maps Javascript API, Paypal Payment SDK, Stripe Payment Gateway, NodeJS, MySQL, HTML, CSS, NGINX, Linux

## Features
- Easy to use UI for customers and staff for order placement and order management.
- Secure and convenient user recognition and authentication with locally stored JWT tokens and one-time passcode system.
- Eliminate wrong delivery addresses for orders with Google Maps Address autocomplete.
- Realtime order management with socket.io technology.
- Fully customize your menu categories, products and product options.
- Control menu hours, delivery zones, delivery fees, and order minimums.

