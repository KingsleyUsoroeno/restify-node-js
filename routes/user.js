const restifyErrors = require('restify-errors');
const bycrpt = require('bcryptjs');
const User = require('../models/User');
const Jwt = require('jsonwebtoken');
const config = require('../config');
 
module.exports = server => {
    // Register User
    server.post('/register', async (req, res, next) => {
         const { email, password  } = req.body;

        // Check if the User Already Exits
        const existingUser = await User.findOne({email});
        if(existingUser){
            console.log(existingUser);
           return res.send({code:"unauthorised",message:"User Already Exits"})
        } 
        
        const user = new User({email, password});
         bycrpt.genSalt(10, (err, salt) => {
             bycrpt.hash(password, salt, async (err, hash) =>  {
                 // Hash password
                user.password = hash
                // Save the User to the Db
                try {
                    const newUser = await user.save();
                    let response = {
                        "status": "Success",
                        "message":"User Created Successfully",
                        "user":newUser
                    }
                    res.send(response);   
                    next()
                } catch (error) {
                    return next(new restifyErrors.InternalServerError(error.message))
                }
             });
         })
    })

    // Authenticate a User into our App
    server.post('/auth', async (req, res, next) => {
        const {email, password} = req.body;
        // Check if that User exists in our DB
        try {
            const user = await User.findOne({email});
            if(!user){
                res.send({code:"unauthorised",message:"Authentication failed"})
            }else{
                // User exists in our Database
                // compare their passwords
                bycrpt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;
                    if(isMatch){
                        // Create and Assign a token
                        const token = Jwt.sign(user.toJSON(), config.JWT_SECRET, {
                            expiresIn:'15m'
                        });

                        const {iat, exp} = Jwt.decode(token);
                        let response = {
                            "status": "Success",
                            "user":user,
                            "iat":iat,
                            "expiresIn": exp,
                            "token": token
                        }
                        res.send(response)
                    }else{
                        res.send({code:"unauthorised",message:"Authentication failed"})
                    }
                    next()
                })
            }
        } catch (error) {
            return next(new restifyErrors.UnauthorizedError(error.message)) 
        }
    })
}