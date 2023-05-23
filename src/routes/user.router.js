const { getAll, create, getOne, remove, update, verifyCode, login, loggedUser } = require('../controllers/user.controller');
const express = require('express');
const verifyJWT = require('../utils/verifyJWT');

const userRouter = express.Router();

userRouter.route('/')
    .get( getAll)
    .post(create);

userRouter.route('/verify/:id')
    .get(verifyCode);

userRouter.route('/login')
    .post(verifyJWT, login);

userRouter.route('/me')
    .get(verifyJWT, loggedUser)

userRouter.route('/:id')
    .get(verifyJWT, getOne)
    .delete(verifyJWT, remove)
    .put(verifyJWT, update);

module.exports = userRouter;