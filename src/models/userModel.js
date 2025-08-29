const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required: true,
        unique: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: "Invalid email address",
        }
    },
    password:{
        type:String,
        required: true
    },
    role:{
        type: String,
        required:true,
        enum: ["admin","manager","user"],
    }
},{
    timestamps:true,
})

module.exports = mongoose.model("User",userSchema);
