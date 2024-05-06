const express = require("express");
const fs = require('fs');
const users = require("./MOCK_DATA.json")

const app = express();
const PORT = 8000;

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
app.get('/api/users', (req,res)=> {
  // console.log("I am in get", req.myUserName);
  res.setHeader('myName','Juhi'); //custom Header
  return res.json(users);
})

app.get('/users', (req,res)=> {
  const html = `
  <ul>
  ${users.map((user)=> `<li> ${user.first_name}</li>`).join("")}
  </ul>
  `
  res.send(html);
})

app
.route("/api/users/:id")
.get((req,res) => {
  const id = Number(req.params.id);
  const user = users.find(user => user.id === id);
  if(!user) return res.status(404).json({error: "user not found"});
  return res.json(user);
})
.patch((req,res) => {
  //edit user with id 
  res.json({status: "pending"});
})
.delete((req,res) => {
  //delete user with id 
  res.json({status: "pending"});
}) 

// app.get("/api/users/:id", (req,res) => {
//   const id = Number(req.params.id);
//   const user = users.find(user => user.id === id);
//   return res.json(user);
// })

app.post('/api/users', (req,res) => {
  const body = req.body;
  if(!body || !body.first_name || !body.last_name || !body.gender || !body.email || !body.job_title){
    return res.status(400).json({ msg: "All fields are req..."});
  }
  users.push({...body, id: users.length + 1});
  fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err,data)=>{
    return res.status(200).json({status: "success", id: users.length });
  })
})

// app.patch('./api/users/:id', (req,res) => {
//   //TODO: Edit the user with id
//   return res.json({status: "pending"});
// })

// app.delete('./api/users/:id', (req,res) => {
//   //TODO: Delete the user with id 
//   return res.json({status: "pending"});
// })

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`))