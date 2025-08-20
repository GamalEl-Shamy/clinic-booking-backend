const express = require("express");
const { addNewUser, getAllUsers, updateUser, deleteUser, getUserById } = require("../controllers/user");
const router = express.Router();

router.post('/', addNewUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;