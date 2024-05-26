
const express = require('express');
const router = express.Router();
const { getUsers, createUser, getUser, updateUser, deleteUser, loginUser } = require('../controllers/usersController');

router.post('/', createUser);

router.get('/', getUsers);

router.get('/:id', getUser);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

router.post('/login', loginUser);

module.exports = router;
