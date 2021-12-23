const User = require('../../db/models/user-schema/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const userService = require('../../service/user-service');
const { secret } = require('../../../config');

module.exports.createNewUser = async (req, res) => {
  try {
    const { login, password } = req.body;
    const userData = await userService.registration(login, password);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 155520000000,
      httpOnly: true
    });

    return res.json(userData);
  } catch(e) {
    console.log(e);
    res.status(400).send('Incorrect data');
  }
}

module.exports.authorise = async (req, res) => {
  try {
    const { login, password } = req.body;
    const user = await User.findOne({login});
    const userData = await userService.login(login, password);

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 155520000000,
      httpOnly: true
    });

    return res.json(userData);
  } catch(e) {
    console.log(e);
    res.status(400).send('Data is incorrect, error');
  }
}

module.exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const token = await userService.logout(refreshToken);
    res.clearCookie('refreshToken', {path:'/'});
    return res.json(token);
  } catch(e) {
    console.log(e);
  }
}

module.exports.refreshToken = async (req, res, nest) => {
  try {
    const { refreshToken } = req.cookies;
    const userData = await userService.refresh(refreshToken);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 155520000000,
      httpOnly: true
    }).send(userData);
  } catch(e) {
    res.status(403).send('The token is not sended or is incorrect');
    console.log(e);
  }
}