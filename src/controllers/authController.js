const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AuditService = require("../services/auditService");
const register = async(req,res) => { 
    try{
        const {email, password, role} = req.body;
        const hashedPassword = await bcrypt.hash(password,10); 

        const newUser = new User({email,password:hashedPassword, role});
        await newUser.save();

        // Log successful registration
        AuditService.logUserRegistration({
            email: email,
            role: role,
            ip: req.clientInfo?.ip,
            userAgent: req.clientInfo?.userAgent
        });

        res.status(201).json({message:`User registered with email ${email}`});
    }
    catch(err){

        if (err.name === "ValidationError") {
            return res.status(400).json({ message: err.errors.email?.message || "Validation failed" });
        }

        // res.status(500).json({message:"Something went wrong"});
        res.status(500).json({message:err});
    }

};

const login = async(req,res) => {
    
    try {
        const {email,password} = req.body;
        const user  = await User.findOne({email});
        if(!user){

            // Log failed login attempt - user not found
            AuditService.logLoginAttempt({
                email: email,
                success: false,
                ip: req.clientInfo?.ip,
                userAgent: req.clientInfo?.userAgent,
                details: 'User not found'
            });

            return res.status(404).json({message:`User with email ${email} not found`})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){

            // Log failed login attempt - invalid password
            AuditService.logLoginAttempt({
                email: email,
                success: false,
                ip: req.clientInfo?.ip,
                userAgent: req.clientInfo?.userAgent,
                details: 'Invalid password'
            });

            return res.status(400).json({message:`Invalid credentials`});
        }
        const token = jwt.sign(
            {id: user._id, role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:"1h"}
        );

        // Log successful login attempt
        AuditService.logLoginAttempt({
            email: email,
            success: true,
            ip: req.clientInfo?.ip,
            userAgent: req.clientInfo?.userAgent,
            details: 'Login successful'
        });

        return res.status(200).json({
            token,
            message:`Welcome ${email}`,
            user,
            success:"true"
        });
    } catch (err) {
        res.status(500).json({message:"Something went wrong"});
    }
};

module.exports = {
    login,
    register
};