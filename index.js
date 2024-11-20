const express = require('express');
const app = express();
const path = require('path');
const env = require('dotenv').config();
const db = require('./config/db');
const PORT = process.env.PORT;
db();
const userRouter = require('./routes/userRouter')


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set('view engine','ejs');
app.set('views',[path.join(__dirname,'views/user'),path.join(__dirname,'views/admin')]);
app.use(express.static(path.join(__dirname, 'public')));


app.use('/',userRouter)

app.listen(PORT,(req,res)=>{
    console.log(`server Running on PORT ${PORT}`);
    
});


module.exports = app;