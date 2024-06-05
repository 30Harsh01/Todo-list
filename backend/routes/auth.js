const express = require('express')
const User = require('../src/models/UserSchema')
const router = express.Router();
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken')
const fetchUser=require('../middleware/fetchUser')
const JWT_SCRET='harshwebsite'    //this must be kept screat


//create a user using : POST "/api/auth/" 


router.post('/createuser',[
    body('name','message-Enter a valid name').isLength({min:5}),
    body('email').isEmail(),
    body('password').isLength({min:8})
], async (req, res) => {
    // obj={
        //     name:'harsh',
        //     age:21
        // }
        // res.json(obj)
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        try{
            let user=await User.findOne({email:req.body.email})
            if(user){
                return res.status(400).json({"Error message":"The user already exist"})
            }
            let secPass=await bcrypt.hash(req.body.password,10)
            user =await User.create({
                name:req.body.name,
                email:req.body.email,
                password:secPass,
            })
            
            const data={
                user:{
                    id:user.id
                }
            }
            const authtoken=await jwt.sign(data,JWT_SCRET)

            // console.log(authtoken)

            // res.json({"user":user})
            res.json({authtoken})
        }catch(err){
            res.json({"err":err})
            // console.log(err)
            res.status(500)
        }

        // I am using this method previously because i havent use async that time 
        // then(user=>res.json(user))
        // .catch(err=>{
        //     console.log(err)
        //     res.json({error:"Email already occupied"})
        // })
        // console.log(req.body)
        // const user = User(req.body)
        // user.save()
        // res.json([])
})


//login
router.post('/login', [
    body('email').isEmail(),
    body('password').exists()
  ], async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "User doesn't exist" });
      }
  
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ error: "Incorrect password" });
      }
  
      const data = {
        user: {
          id: user.id
        }
      };
      const authtoken = jwt.sign(data, JWT_SCRET);
      res.json({ authtoken });
  
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
    }
});


router.post('/getuser', fetchUser, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user);
    }catch (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
    }
});
  
module.exports = router;