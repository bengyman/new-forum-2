const express = require('express');
const router = express.Router();
const userController = require('../../../server/controllers/user.controller');

router.post('/', userController.createUser);
router.get('/:id', userController.getUser);

module.exports = router;
