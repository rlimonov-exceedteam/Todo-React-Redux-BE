const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { verifyAccessToken } = require('../middlewares/verifyAccessToken');

const {
  createNewUser,
  authorise,
  refreshToken,
  logout
} = require('../controllers/user.controller');

const {
  addTask,
  getAllTasks,
  updateTask,
  changeTaskStage,
  deleteTask
} = require('../controllers/task.controller');

router.post('/createNewUser', [
  check('login', "Login cannot be empty").notEmpty(),
  check('password', "Password cannot be empty").notEmpty()
], createNewUser);
router.post('/authorise', authorise);
router.get('/refreshToken', refreshToken);
router.get('/logout', logout);

router.get('/getAllTasks', verifyAccessToken, getAllTasks);
router.post('/createNewTask', verifyAccessToken, addTask);
router.patch('/updateTask', verifyAccessToken, updateTask);
router.patch('/changeTaskStage', verifyAccessToken, changeTaskStage);
router.delete('/deleteTask', verifyAccessToken, deleteTask);

module.exports = router;