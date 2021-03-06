var express = require('express');
var router = express.Router();
var auth = require("../controllers/AuthController.js");
var message = require('../controllers/MessageController.js');
var swap = require('../controllers/SwapController');
var global = require('../controllers/GlobalMessageController');
var sudo = require('../controllers/SudoController');

// restrict index for logged in user only
router.get('/', auth.home);

// route to register page
router.get('/register', auth.register);

// route for register action
router.post('/register', auth.doRegister);

// route to login page
router.get('/login', auth.login);

// route for login action
router.post('/login', auth.doLogin);

// route for logout action
router.get('/logout', auth.logout);

// route for a new message
router.post('/message', message.addNew);

// route to see all messages
router.get('/message', message.seeAll);

// route to send globalMsg
router.get('/message/global', global.doForm);

// route to save globalMsg
router.post('/message/global', global.saveMsg);

// route to see only your messages
router.get('/message/sent', message.getOwnSent);

// route to see only your recieved messages
router.get('/message/recieved', message.getOwnRecieved);

// route for swap init
router.get('/swapMsg/:id', swap.doSwap);

// sudo get
router.get('/sudo', sudo.displayForm);

// sudo post
router.post('/sudo', sudo.saveNewMessage);

module.exports = router;