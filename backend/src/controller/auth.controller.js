import userModel from "../models/user.model.js";
import { config } from "../config/config.js";
import jwt from "jsonwebtoken";


async function sendTokenResponse(user , res , message){
    
     const token = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("token", token, {
  httpOnly: true,
  secure: config.NODE_ENV === "production",
  sameSite: config.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

    res.status(200).json({
        message,
        success: true,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role
        }
    })

}


export const register = async (req, res) => {

    const{email,password,fullname,contact , isSeller} = req.body;

    try {
        
        
        const existingUser = await userModel.findOne({
            $or:[
                {email},
                {contact}
            ]
        });

        if(existingUser){
            return res.status(400).json({message:"User with same email or contact already exists"});
        }

        const user = await userModel.create({
            email,
            password,
            fullname,
            contact,
            role :  isSeller ? "seller" : "buyer"
        });

          await sendTokenResponse(user, res, "User registered successfully")

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "server error" });
    }
}

export const login = async(req,res) => {
    const {email,password} = req.body;

    try{
           const user = await userModel.findOne({email})

           if(!user){
            return res.status(400).json({message:"Invalid email or password"});
           }

           const match = await user.comparePassword(password);

           if(!match){
            return res.status(400).json({message:"Invalid email or password"});
           }

           await sendTokenResponse(user, res, "User logged in successfully")

    }catch(error){
        console.log(error);
        return res.status(500).json({ message: " internal server error" });
    }

}

export const getMe = async(req,res) => {
    const user = req.user;
    return res.status(200).json({
        message: "User fetched successfully",
        success: true,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role
        }
    })
}



export const googleCallback = async(req,res) => {
    
    const { id, displayName, emails, photos } = req.user;
    const email = emails[0].value;;
    const profilePic = photos[0].value;

    let user = await userModel.findOne({email});
    if(!user){
        user = await userModel.create({
            email,
            googleId: id,
            fullname : displayName,
        })
    }

    const token = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    })

res.cookie("token", token, {
  httpOnly: true,
  secure: config.NODE_ENV === "production",
  sameSite: config.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

     // console.log(req.user);
    res.redirect("http://localhost:5173");

    // res.redirect(config.FRONTEND_URL);

}