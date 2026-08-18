// src/controllers/authController.js
// Developed by: Markerson D Flomo and FATEHALRAHMAN HUSSEIN AHMED ALHASSAN, Reg No: 20724/2022 and 23782/2024


const bcrypt = require('bcrypt');
const user = require('../models/User');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');

exports.signup = async (req, res, next) => {
    try {
      const { email, firstName, lastName, password, type } = req.body;
      if (!email || !firstName || !lastName || !password || !type) {
        return res.status(400).json({ status: 400, error: 'All fields are required' });
      }
  
      //Declare user
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ status: 400, error: 'User already exists' });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const user = new User({
        email,
        firstName,
        lastName,
        password: hashedPassword,
        type,
        isAdmin: type === 'staff' ? req.body.isAdmin || false : false
      });
  
      await user.save(); //Save the user after declaring it
  
      const token = generateToken(user);
      res.status(201).json({
        status: 201,
        data: {
          token,
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      });
    } catch (error) {
      next(error);
    }
};
  


exports.signin =async (req, res, next) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({status: 400, error: 'Invalid Credentials'});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({status: 400, error: 'Invalid Credentials'});

        const token = generateToken(user);
        res.status(200).json({
            status: 200,
            data: {
                token,
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    }catch(error){
        next(error);
    }
};