const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//signup route handler
exports.signup = async(req,res) => {
    try{
        //get data
        const {name,email,password,role} = req.body;
        //check if user already exist
        const existingUser = await User.findOne({email});
        if(existingUser)
        {
            return res.status(400).json({
                success:false,
                message:'User already Exists',
            });
        }

        //secure password
        let hashedPassword
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(err)
        {
            return res.status(500).json({
                success:false,
                message:'Error in hashing Pasword',
            })
        }

        //create entry for User
        const user = await User.create({
            name,email,password:hashedPassword,role
        });

        return res.status(200).json({
            success:true,
            message:'User created successfully',
        });

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User cannot be registered, please try again later',
        });
    }
}

// http://localhost:4000/api/v1/signup
// {
//     "name": "Vibha",
//     "email": "vibhasahu@gmail.com",
//     "password":"iamvibha",
//     "role":"Admin"
// }


//login handler
exports.login = async(req,res) => {
    try{
        //data fetch
        const {email, password} = req.body;

        //validation on email and password
        if(!email || !password) {
            return res.status(400).json({
                success:false,
                message:'Please fill all the details carefully',

            })
            
        }

        //check for registered user
        const user = await User.findOne({email});
        //if not a registered user
        if(!user){
            return res.status(401).json({
                success:false,
                message:'User is not registered',

            });
        }

        //data we want to sent in token
        const payload = {
            email: user.email,
            id:user._id,
            role:user.role,
        };
        //verify password & generate a JWT Token
        if(await bcrypt.compare(password, user.password))
        {
            //password matches then login
            //create token
            let token = jwt.sign(payload,
                process.env.JWT_SECRET,
                {
                    expiresIn:"2h",
                });


        }
        else{
            //password do not match
            return res.status(403).json({
                success:false,
                message:'Password Incorrect',

            });

        }
    }
    catch(error)
    {

    }
}