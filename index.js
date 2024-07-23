const express = require("express")
const fs = require("fs")
const users = require("./MOCK_DATA.json")

const app = express()
const PORT = 8000


app.use(express.urlencoded({extended: false}))  

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
  return res.json(users)
})

//Express feature for variable|dynamic parameter  " : "

app.route('/api/users/:id')
   .get((req,res)=>{ 
    const id = Number(req.params.id)
    const user = users.find((user) => user.id === id)    
    return res.json(user)
    })
    .patch((req,res)=>{   
        // TODO: Update/Edit a particular id/user
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



app.post('/api/users',(req,res)=>{ 
    // TODO: create new user
    const body = req.body;
    users.push({...body, id: users.length + 1})
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{ 
        return    res.json({status: "success", id: users.length})
    })
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