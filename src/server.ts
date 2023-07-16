import express from 'express'
import db from './config/db'
import router from './routes'
import cors from 'cors'

const app = express()
const PORT = 3000
const HOST = '0.0.0.0'

app.use(cors())
app.use(express.json())
app.use('/ps', router)

app.get('/', (req,res)=>{
    res.send('Aobaaa 5')
})


app.listen(PORT, HOST, async()=>{
    await db()
    console.log('Server running')
})