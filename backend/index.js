const express = require("express")
const users = require("./sample.json")

const app=express();

port = 3000;

app.get('/users',(req,res)=>{
    res.json({users})

})

app.listen(port ,(err)=>{
    console.log(`Server is run http://localhost:${port}`)
})