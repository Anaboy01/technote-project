const express = require('express');
const { getAllUsers, createNewUser, updateUser, deleteUser } = require('../controller/controller');
const router = express.Router()
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router.route('/').get(getAllUsers).post(createNewUser).patch(updateUser).delete(deleteUser);

module.exports = router