import express from 'express'

import router from './routes/index.js'
import "dotenv/config"
const app = express()
const PORT = 3333

app.use(express.json())
app.use(router)
app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`)
})