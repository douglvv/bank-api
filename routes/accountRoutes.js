const express = require('express');
const AccountController = require('../controllers/AccountController');
const router = express.Router()

router.post('/login', AccountController.login);
router.post('/create', AccountController.createAccount);
router.get('/:id', AccountController.showAccount);
router.post('/:id/delete', AccountController.deleteAccount);
router.post('/:id/edit', AccountController.editAccount);
router.post('/:id/deposit', AccountController.deposit);
router.post('/:id/withdraw', AccountController.withdraw);
router.get('/:id/statement', AccountController.showStatement);
router.post('/:id/transfer', AccountController.transfer)

module.exports = router