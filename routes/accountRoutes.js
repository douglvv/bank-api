const express = require('express');
const AccountController = require('../controllers/AccountController');
const router = express.Router()
const checkAuth = require('../middlewares/Auth');

router.post('/login', AccountController.login);
router.post('/create', AccountController.createAccount);
router.get('/:id', checkAuth, AccountController.showAccount);
router.post('/:id/delete', checkAuth, AccountController.deleteAccount);
router.post('/:id/edit', checkAuth, AccountController.editAccount);
router.post('/:id/changePassword', checkAuth, AccountController.changePassword);
router.post('/:id/deposit', AccountController.deposit);
router.post('/:id/withdraw', checkAuth, AccountController.withdraw);
router.get('/:id/statement', checkAuth, AccountController.showStatement);
router.post('/:id/transfer', checkAuth, AccountController.transfer)

module.exports = router