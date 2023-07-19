import dotvenv from 'dotenv'

dotvenv.config()

export const keys = {
    "MONGO_URL": process.env.MONGO_URL,
    "COMPANIES_SECRET_KEY": process.env.COMPANIES_SECRET_KEY,
    "USERS_SECRET_KEY": process.env.USERS_SECRET_KEY,
}