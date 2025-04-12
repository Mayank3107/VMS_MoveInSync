const express=require('express')
const app=express();
const cors=require('cors')

require('dotenv').config();
const connection=require('./config/Db');
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connection(process.env.MONGO_URI);
const PORT=process.env.PORT
app.listen(PORT,()=>{
    console.log(`App is listening on port number=${PORT}`)
})

const auth=require('./routes/auth')
const admin=require('./routes/Admin')
const profileRoute = require('./routes/Profile');
const visitor=require('./routes/Visitor')
const employee=require('./routes/Employee')
const guard=require('./routes/Guard')
const profile=require('./routes/Profile')
app.use('/profile', profileRoute);
app.use('/auth',auth);
app.use('/admin',admin)
app.use('/visitor',visitor)
app.use('/employee',employee)
app.use('/guard',guard)
app.use('/profile',profile)
