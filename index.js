const express = require("express")
const fs = require("fs")
const users = require("./MOCK_DATA.json")
const mongoose = require("mongoose")
const { error } = require("console")

const app = express()
const PORT = 8000

//Connection
mongoose
       .connect("mongodb://127.0.0.1:27017/youtube-app-1")
       .then(()=>{console.log("MongoDB Conneted")})
       .catch((err)=>console.log('MOngo Error',err))


// Schema
const userSchema = new mongoose.Schema({  
    firstName: { 
        type: String,
        required: true,
    },
    lastName: { 
        type: String,
    },
    email: { 
        type: String,
        required: true,
        unique: true,
    },
    jobTitle: { 
        type: String,
    },
    gender: { 
        type: String,
    },
},{timestamps: true})

const User = mongoose.model("user",userSchema)






// Middleware Plugin

app.use(express.urlencoded({extended: false})) 

app.use((req,res,next)=>{
    fs.appendFile('log.txt', `${Date.now()}: ${req.ip}: ${req.method}: ${req.path}\n`, (err,data)=>{ next(); } )
    
})




// Routes

// Example of an hybrid server 

app.get('/users',(req,res)=>{
  const html = `
     <ul>
     ${users.map((user)=>`<li>${user.first_name}</li>`).join("")}
     </ul>
  `
  res.send(html)    
})

// REST API
app.get("/api/users",(req,res)=>{
  res.setHeader('X-MyName','Shivank Jain')  
  console.log(req.headers)
  return res.json(users)
})

//Express feature for variable|dynamic parameter  " : "

app.route('/api/users/:id')
   .get((req,res)=>{ 
    const id = Number(req.params.id)
    const user = users.find((user) => user.id === id) 
    if(!user) return res.status(404).json({error: 'user not found'})   
    return res.json(user)
    })
    .patch((req,res)=>{   
        // TODO: Update/Edit a particular id/user
        const id = parseInt(req.params.id)
        const user = users.find((user)=> user.id === id)
        if(!user){ 
            return res.status(404).json({message: 'User not found'})
        }

        user.email = req.body.email || user.email
        return res.json(user)

        //    return    res.json({status: "pending"})
         })
    .delete((req,res)=>{  
        // TODO: delete a user/id
        const id = Number(req.params.id)
        const user = users.find((user) => user.id === id )
         if(!user){ 
            return res.status(404).json({message: 'User not found'})
         }

         // array.splice(start, deleteCount, item1, item2, ...)

        const deletedUser = users.splice(users.findIndex(user=>user.id === id),1)
        
        return res.json(deletedUser)
        //    return    res.json({status: "pending"})
    })



app.post('/api/users',async (req,res)=>{ 
    // TODO: create new user
    const body = req.body;

     if(!body || 
        !body.first_name || 
        !body.last_name || 
        !body.email || 
        !body.gender || 
        !body.job_title){
      return res.status(400).json({msg: 'All fields are required'}) 
    }
        
    const result = await User.create({ 
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        gender: body.gender,
        jobTitle: body.job_title,
    }) 
     
    // console.log('result',result)

    return res.status(201).json({msg: 'success'})

    // users.push({...body, id: users.length + 1})
    // fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{ 
    //     return    res.status(201).json({status: "success", id: users.length})
    // })
})




app.listen(PORT,()=>console.log(`Server Started At PORT: ${PORT}`))





// ###########  FOR SAME ROUTE WE CAN MERGE ############

// app.get('/api/users/:id',(req,res)=>{ 
//     const id = Number(req.params.id)
//     const user = users.find((user) => user.id === id)    
//     return res.json(user)
// })

// app.patch('/api/users/:id',(req,res)=>{ 
//     // TODO: Update/Edit a particular id/userr
//    return    res.json({status: "pending"})
// })

// app.delete('/api/users/:id',(req,res)=>{ 
//     // TODO: delete a user/id
//    return    res.json({status: "pending"})
// })