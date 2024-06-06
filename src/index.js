const connectToMongogo=require('./databse/conn')
const cors=require('cors')
const express=require('express')
const app=express()
const port=process.env.PORT ||5000

app.use(cors())  //to handle with cors policy
app.use(express.json())  
connectToMongogo();



app.use('/api/auth',require('../routes/auth'))
app.use('/api/notes',require('../routes/notes'))



app.listen(port,()=>{
    console.log(`port is running at ${port}`)
})