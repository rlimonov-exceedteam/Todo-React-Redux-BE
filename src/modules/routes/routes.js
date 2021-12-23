const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

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

router.get('/getAllTasks', getAllTasks);
router.post('/createNewTask', addTask);
router.patch('/updateTask', updateTask);
router.patch('/changeTaskStage', changeTaskStage);
router.delete('/deleteTask', deleteTask);

module.exports = router;