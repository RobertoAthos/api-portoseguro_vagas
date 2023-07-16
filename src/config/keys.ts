import dotvenv from 'dotenv'

dotvenv.config()

export const keys = {
    "MONGO_URL": process.env.MONGO_URL
}