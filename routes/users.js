import Router from 'express';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const usersRouter = Router();

usersRouter.get(`/`, async (req, res) => {
  const userList = await User.find().select('-passwordHash');

  if (!userList) {
    return res.status(500).json({ success: false });
  }

  return res.send(userList);
});

usersRouter.get(`/:id`, async (req, res) => {
  let user;

  try {
    user = await User.findById(req.params.id).select('-passwordHash');
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: 'The user was not found.' });
  }

  return res.send(user);
});

usersRouter.post(`/`, async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
    phone: req.body.phone,
    street: req.body.street,
    apartmment: req.body.apartmment,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    isAdmin: req.body.isAdmin,
  });

  const savedUser = await user.save();

  if (!savedUser) {
    return res.status(404).send('The user cannot be created.');
  }

  return res.status(201).send(savedUser);
});

usersRouter.post(`/login`, async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.JWT_SECRET;
  if (!user) {
    return res.status(400).send('User not found.');
  }

  if (user && bcrypt.compareSync(req.body.passwordHash, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: '1d' }
    );
    res.status(200).send({ user: user.email, token: token });
  } else {
    res.status(400).send('Invalid Password.');
  }
});

usersRouter.get(`/get/count`, async (req, res) => {
  let userCount;

  try {
    userCount = await User.countDocuments((count) => count);
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }

  return res.status(200).send({
    count: userCount,
  });
});

usersRouter.delete(`/:id`, async (req, res) => {
  let removedUser;

  try {
    removedUser = await User.findByIdAndRemove(req.params.id);
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }

  if (!removedUser) {
    res
      .status(404)
      .json({ success: false, message: 'The user was not found.' });
  }

  res.status(200).json({ success: true, message: 'The user was deleted.' });
});

export default usersRouter;
