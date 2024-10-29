const express = require('express');
const { searchMovie } = require('../controllers/user/movieController');
const { searchMatinee} = require('../controllers/user/movieController');
const { test} = require('../controllers/user/movieController');
const { getMovie} = require('../controllers/user/movieController');
const { getShows} = require('../controllers/user/movieController');
const { getSeatings} = require('../controllers/user/movieController');
const { payment} = require('../controllers/user/bookingController');
const { verifyPayment} = require('../controllers/user/bookingController');
const { bookings} = require('../controllers/user/bookingController');
const { handler} = require('../controllers/user/whatsappController');

const router = express.Router();

// Define the route for user registration
router.get('/searchMovie', searchMovie);
router.get('/searchMatinee', searchMatinee);
router.get('/test', test);
router.get('/getMovie', getMovie);
router.get('/getShows', getShows);
router.get('/getSeatings', getSeatings);
router.post('/payment', payment);
router.post('/verify-payment', verifyPayment);
router.get('/bookings', bookings);
router.post('/send-whatsapp', handler);

// Export the router to be used in the main server file

module.exports = router;

