// Three middlewares
// Auth, isStudent, isAdmin

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req,res, next) => {
    try{
        //extract JWT token
        //PENDING: other wways to fetch token
        console.log("cookie: ", req.cookies.token);
        console.log("body: ", req.body.token);
        console.log("header: ", req.header("Authoization"));

        const token = req.cookies.token || req.body.token || req.header("Authoization").replace("Bearer ","");

        if(!token)
        {
            return res.status(401).json({
                success:false,
                message:'Token Missing',

            });
        }

        //verify the token
        try{
            //user verify to decode the token
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log("payload: ",payload);
            //insert payload token to user
            // user = user.toObject();
            req.user = payload;
            console.log("req.user: ", req.user);
        }
        catch(error)
        {
            return res.status(401).json({
                success:false,
                message:'Token is invalid',

            });
        }

        next();
    }
    catch(error)
    {
        return res.status(401).json({
            success:false,
            message:'Something went wrong, while verifying token',

        });
    }

}

//now from auth, we have token in user object

exports.isStudent = (req, res, next) => {
    try{
        console.log("req.user: ",req.user);
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success:false,
                message:'This is protected route for students',
    
            }); 
        }
        next();

    }catch(error){
        return res.status(500).json({
            success:false,
            message:'User role is not matching',

        }); 

    }
    
}


exports.isAdmin = (req, res, next) => {
    try{
        console.log("req.user: ",req.user);
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success:false,
                message:'This is protected route for admin',
    
            }); 
        }
        next();

    }catch(error){
        return res.status(500).json({
            success:false,
            message:'User role is not matching',

        }); 

    }
    
}