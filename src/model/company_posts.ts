import mongoose from "mongoose";


const PostsSchema = new mongoose.Schema({
    name: {type: String, required:true},
    salary:{type: Number, required:true},
    location:{type: String, required:true},
    about: {type: String, required:true},
})

export const PostsModel = mongoose.model('posts', PostsSchema)