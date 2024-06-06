const express = require('express');
const User = require('../src/models/UserSchema');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');
const JWT_SECRET = 'harshwebsite';  // This should be kept secret and ideally stored in environment variables

// Create a user using POST "/api/auth/createuser"
router.post('/createuser', [
  body('name', 'Name is required').notEmpty(),
  body('email', 'Invalid email').isEmail(),
  body('password', 'Password must be at least 8 characters long').isLength({ min: 8 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, password, email } = req.body;

    let newuser = await User.findOne({ email });
    if (newuser) {
      return res.status(400).json({ error: "The user already exists" });
    }

    let secPass = await bcrypt.hash(password, 10);
    newuser = await User.create({
      name,
      email,
      password: secPass,
    });

    const data = {
      user: { _id: newuser._id }
    };
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.status(201).json({ message: "User created", authtoken });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error');
  }
});

// Login
router.post('/login', [
  body('email', 'Invalid email').isEmail(),
  body('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const checkuser = await User.findOne({ email });
    if (!checkuser) {
      return res.status(400).json({ error: "User doesn't exist" });
    }

    const passwordCompare = await bcrypt.compare(password, checkuser.password);
    if (!passwordCompare) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    const data = {
      user: { _id: checkuser._id }
    };
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json({ authtoken });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error');
  }
});

// Get user details
router.post('/getuser', fetchUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.send(user);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
