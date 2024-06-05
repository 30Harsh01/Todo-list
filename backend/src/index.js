const connectToMongogo=require('./databse/conn')
const cors=require('cors')
const express=require('express')
const app=express()
const port=process.env.PORT ||5000
app.use(cors())
app.use(express.json())
connectToMongogo();


// app.set('port', (process.env.PORT || 5000));


app.use('/api/auth',require('../routes/auth'))
app.use('/api/notes',require('../routes/notes'))


// app.listen(app.get('port'), function() {
//     console.log('Server started on port '+app.get('port'));
// });


app.listen(port,()=>{
    console.log(`port is running at ${port}`)
})