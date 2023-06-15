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
        let user = await User.findOne({email});
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
        
        user = user.toObject();
        // console.log(user);
        user.token = token;
        // console.log(user);
        user.password = undefined;
        console.log(user);
        //from now date to 3 days
        const options = {
            expires: new Date( Date.now() + 3*24*60*60*1000),
            httpOnly:true,
        }

        res.cookie("token",token, options).status(200).json({
            success:true,
            token,
            user,
            message:'User Logged in successfully',
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
        console.log(error);
        return res.status(500).json({
            success:false,
            message: 'Login Failure',
        })
    }
}

// http://localhost:4000/api/v1/login
// {
//     "email": "vibhasahu@gmail.com",
//     "password":"iamvibha",
// }

//  http://localhost:4000/api/v1/test
//get request
// {
//     "email": "vibhasahu@gmail.com",
//     "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpYmhhc2FodUBnbWFpbC5jb20iLCJpZCI6IjY0N2EwNDI3NzUzZmIxYWZjNGZhMGZhNCIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTY4Njg2MTAyMiwiZXhwIjoxNjg2ODY4MjIyfQ.Xlts9aa3NG6vQapRzRA09zZHtcyU7MZQ1n-C9VGmM9s"
// }

//  http://localhost:4000/api/v1/student
//get request
// {
   
//     "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpYmhhc2FodUBnbWFpbC5jb20iLCJpZCI6IjY0N2EwNDI3NzUzZmIxYWZjNGZhMGZhNCIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTY4Njg2MTAyMiwiZXhwIjoxNjg2ODY4MjIyfQ.Xlts9aa3NG6vQapRzRA09zZHtcyU7MZQ1n-C9VGmM9s"
// }

//  http://localhost:4000/api/v1/admin
//get request
// {
//     "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpYmhhc2FodUBnbWFpbC5jb20iLCJpZCI6IjY0N2EwNDI3NzUzZmIxYWZjNGZhMGZhNCIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTY4Njg2MTAyMiwiZXhwIjoxNjg2ODY4MjIyfQ.Xlts9aa3NG6vQapRzRA09zZHtcyU7MZQ1n-C9VGmM9s"
// }