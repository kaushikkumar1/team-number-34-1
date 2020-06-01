const router = require('express').Router();
const User =require('../models/User');
const {regesterValidation, loginValidation} =require('../validation')
const bcrypt =require('bcryptjs');
const jwt=require('jsonwebtoken');

//ROUTE TO SIGNUP(REGISTER)
router.post('/register',async (req,res)=>{

    //validation of the data
    const {error,validation} = regesterValidation(req.body);
    if(error) return res.status(401).send("validation error");

    // user alredy exist
    const emailExist =await User.findOne({email:req.body.email});
    if(emailExist) return res.status(400).send({mes:"email alredy exist"});

    //ecryption of the password
    const salt =await bcrypt.genSalt(10);
    const hashPassword =await bcrypt.hash(req.body.password,salt);

    
    const user =new User({
        hostelname: req.body.hostelname,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        city: req.body.city,
        state: req.body.state,
        password: hashPassword
    })
    try{
        const savedUser= await user.save();
        const token =jwt.sign({_id: user._id,email:user.email},process.env.TOKEN_SECRET);
        res.status(200).json(token);
    //  res.status(200).send({ id: user._id, name: user.name});
    }catch(err){
        res.status(500).send(err);  
    }
});

//ROUTE TO LOGIN
router.post('/login',async (req,res)=>{
    
    // login validation
    const {error,validation} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //checking if the email exist
    const user =await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email or password do not exist');

    //passwors is correct or not
    const validpass =await bcrypt.compare(req.body.password,user.password);
    if(!validpass) return res.status(400).send('invalid password');
    
    //create and assign token
    const token =jwt.sign({_id: user._id,email:user.email},process.env.TOKEN_SECRET);
    res.status(200).json(token);
    //res.send("loged in !!!")

});

module.exports = router;