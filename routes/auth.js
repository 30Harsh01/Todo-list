const express = require('express');
const User = require('../src/models/UserSchema');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');
const JWT_SECRET = 'harshwebsite';  // This should be kept secret and ideally stored in environment variables





//create user
router.post('/createuser', [
  body('name', 'Name is required').notEmpty(),  //check for name is empty or not
  body('email', 'Invalid email').isEmail(),     //check weather email is valid or not
  body('password', 'Password must be at least 8 characters long').isLength({ min: 8 })  //check weather password is havong min length of 8 or not
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, password, email } = req.body;   //require all these things from the body

    let newuser = await User.findOne({ email });      //check if the user already exist with the same email or not as email is our primary key if user exist than simply return user already exist
    if (newuser) {
      return res.status(400).json({ error: "The user already exists" });
    }

    let secPass = await bcrypt.hash(password, 10);   //concept of securing password using bcryptjs so that in case database is hacked or something still the password wont be accessed
    newuser = await User.create({  //creating the user
      name,
      email,
      password: secPass,
    });

    const data = {                        //creating a data object for middleware function
      user: { _id: newuser._id }
    };
    const authtoken = jwt.sign(data, JWT_SECRET);   //signing a JWT token for authenticaiton 
    res.status(201).json({ message: "User created", authtoken });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error');
  }
});






// Login
router.post('/login', [                                     //checking all the fields
  body('email', 'Invalid email').isEmail(),                 //weather they are correct or not 
  body('password', 'Password is required').exists()         //using express-validator
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const checkuser = await User.findOne({ email });          //check weather user exist or not if not then please signin first
    if (!checkuser) {
      return res.status(400).json({ error: "User doesn't exist" });
    }

    const passwordCompare = await bcrypt.compare(password, checkuser.password);  //check the password by decrypting it using same bcryptjs
    if (!passwordCompare) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    const data = {
      user: { _id: checkuser._id }
    };
    const authtoken = jwt.sign(data, JWT_SECRET);   //signing the JWT token
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
    const user = await User.findById(userId).select("-password");   //we can have the user without selecting the password

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
