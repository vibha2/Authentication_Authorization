// Three middlewares
// Auth, isStudent, isAdmin

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req,res, next) => {
    try{
        //extract JWT token
        //PENDING: other wways to fetch token
        const token = req.body.token || req.cookies.token;

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
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            //insert decode token to user
            req.user = decode;
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

exports.isStudemt = (req, res, next) => {
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