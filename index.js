const express = require("express");
const fs = require('fs');
const mongoose = require("mongoose");

// const users = require("./MOCK_DATA.json")

const app = express();
const PORT = 8003;

//Connection
mongoose
.connect("mongodb://127.0.0.1:27017/youtube-app-1")
.then(()=> console.log("MongoDB Connected"))
.catch(err => console.log('Mongo error', err));

//Schema
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname : {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,  //two same email ids cannot exist
  },
  jobTitle:{
    type: String,
  },
  gender:{
    type: String,
  }
}, { timestamps: true});

const User = mongoose.model('user',userSchema)

//middleware
app.use(express.urlencoded({ extended: false}));

// app.use((req,res,next)=> {
//   console.log("Helllo from middleware 1");    ///hold pe chala gya
// })

// app.use((req,res,next)=> {
//   console.log("Helllo from middleware 1");    ///hold pe chala gya
//   return res.json({mgs: "Hello from middleware 1"}); ///yahi return ho jayega sab, aage ke routes pe jayega hi ni 
// })

app.use((req,res,next)=> {
  //creating /keeping log
  fs.appendFile("log.txt", `\n${Date.now()}: ${req.ip} ${req.method}: ${req.path}\n`, (err, data) => {
    next();
  })
  // console.log("Helllo from middleware 1");    ///hold pe chala gya
  // req.myUserName ="piyushgarg.dev"
  // next(); /////execute the next functns routes
})
// app.use((req,res,next)=> {
//   console.log("Helllo from middleware 2", req.myUserName);    ///hold pe chala gya

// /  return res.end("Hey!"); /////return, hence next functns not executed

//    next();
// })

//ROUTES
app.get('/api/users', async (req,res)=> {
const allDbUsers = await User.find({});
// res.setHeader('myName','Juhi'); //custom Header
return res.json(allDbUsers);
})

app.get('/users', async (req,res)=> {
  const allDbUsers = await User.find({});
  const html = `
  <ul>
  ${allDbUsers.map((user)=> `<li> ${user.firstname} - ${user.email}</li>`).join("")}
  </ul>
  `
  res.send(html);
})

app
.route("/api/users/:id")
.get(async (req,res) => {
  const user = await User.findById(req.params.id);
  // const id = Number(req.params.id);
  // const user = users.find(user => user.id === id);
  if(!user) return res.status(404).json({error: "user not found"});
  return res.json(user);
})
.patch(async (req,res) => {
  await User.findByIdAndUpdate(req.params.id, {lastname: "Changed"});
  //edit user with id 
  return res.json({status: "success"});
})
.delete(async(req,res) => {
  await User.findByIdAndDelete(req.params.id)
  return res.json({status: "Success"});
}) 

// app.get("/api/users/:id", (req,res) => {
//   const id = Number(req.params.id);
//   const user = users.find(user => user.id === id);
//   return res.json(user);
// })

app.post('/api/users', async (req,res) => {
  const body = req.body;
  if(!body || 
    !body.first_name || 
    !body.last_name || 
    !body.gender || 
    !body.email || 
    !body.job_title){
    return res.status(400).json({ msg: "All fields are req..."});
  }

  const result = await User.create({
    firstname: body.first_name,
    lastname: body.last_name,
    email: body.email,
    gebder: body.gender,
    jobTitle: body.job_title
  });

  return res.status(201).json({msg: "success"});
  
  // users.push({...body, id: users.length + 1});
  // fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err,data)=>{
  //   return res.status(200).json({status: "success", id: users.length });
  // })
})

// app.patch('./api/users/:id', (req,res) => {
//   //TODO: Edit the user with id
//   return res.json({status: "pending"});
// })

// app.delete('./api/users/:id', (req,res) => {
//   //TODO: Delete the user with id 
//   return res.json({status: "pending"});
// })

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`)) ///chnge
//chng3