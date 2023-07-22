import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    fullName: {type: String, required:true},
    email: {type: String, required:true},
    password: {type: String, required:true},
    location: {type:String, required:true},
    cv: String,
    avatar: String
})

export const UserModel = mongoose.model('Users', UserSchema)