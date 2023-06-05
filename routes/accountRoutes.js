const express = require('express');
const AccountController = require('../controllers/AccountController');
const router = express.Router()

router.post('/add', AccountController.createAccount);
router.get('/get/:id', AccountController.showAccount);
router.post('/delete/:id', AccountController.deleteAccount);
router.post('/edit/:id', AccountController.editAccount);


module.exports = router