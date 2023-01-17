const express = require('express')
const authRoutes = require('./src/auth/authRoutes')


const app =express();
const port =5000

app.use(express.json())


app.get("/",(req,res)=>{
    res.send('Hello world')
})

app.use('/api/v1/',authRoutes)

app.listen(port,()=>{console.log(`app listening on port ${port}`)})