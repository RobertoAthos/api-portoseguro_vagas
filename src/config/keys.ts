import dotvenv from 'dotenv'

dotvenv.config()

export const keys = {
    "MONGO_URL": process.env.MONGO_URL,
    "COMPANIES_SECRET_KEY": process.env.COMPANIES_SECRET_KEY,
    "USERS_SECRET_KEY": process.env.USERS_SECRET_KEY,
    "R2_ACCESS_KEY_ID": process.env.R2_ACCESS_KEY_ID,
    "R2_SECRET_ACCESS_KEY": process.env.R2_SECRET_ACCESS_KEY,
    "R2_ENDPOINT": process.env.R2_ENDPOINT
}