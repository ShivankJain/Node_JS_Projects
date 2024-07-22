const express = require("express")
const users = require("./MOCK_DATA.json")

const app = express()
const PORT = 8000

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
        // TODO: Update/Edit a particular id/userr
        //    return    res.json({status: "pending"})
         })
    .delete((req,res)=>{  
        // TODO: delete a user/id
        //    return    res.json({status: "pending"})
    })



app.post('/api/users',(req,res)=>{ 
    // TODO: create new user
   return    res.json({status: "pending"})
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