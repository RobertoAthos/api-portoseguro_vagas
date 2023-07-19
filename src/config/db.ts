import mongoose from "mongoose";
import { keys } from "./keys";

export default async function connect() {
    const MONGO_URL =  keys.MONGO_URL

    try {
        await mongoose.connect(MONGO_URL!)
        console.log('Database connected')
    } catch (error) {
        console.log(error)
    }
}
