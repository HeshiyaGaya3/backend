const express = require("express");
const fs = require("fs");

const app = express();
const port = 8080;

app.use(express.json());

// Read DB once (sync for simplicity)
const db = JSON.parse(fs.readFileSync("./db.json", "utf8"));

// GET all users
app.get("/", (req, res) => {
  res.json(db.users);
});

// GET user by id
app.get("/user/:id", (req, res) => {
  const id = Number(req.params.id);

  const user = db.users.find((item) => item.id === id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

//delete user
app.delete("/user/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = db.users.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  // Remove user
  const deletedUser = db.users.splice(index, 1);

  // Save updated DB back to file
  fs.writeFileSync("./db.json", JSON.stringify(db, null, 2));

  res.json({
    message: "User deleted successfully",
    user: deletedUser[0],
  });
});

app.put("/user/:id", (req, res) => {
  const id = Number(req.params.id);
  const newName = req.body.name;
  const newEmail = req.body.email;
  console.log("acbfy",req.body.name);
  const dbData = db.users.find((item) => item.id === id);

  if (!dbData) {
    res.status(404, "user not found");
  }

  dbData.name = newName;
  dbData.email = newEmail;

  fs.writeFileSync("./db.json", JSON.stringify(db, null, 2));

  res.json({
    message: "User deleted successfully",
    users: db.users,
  });
});

app.post("/user/", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  if(!db)
    res.status(404, "db not found");

  const index = db.users.length+1
  const dataObj = {
    "id": index,
    "name" : name,
    "email" : email
  }

  db.users.push(dataObj);
  fs.writeFileSync("./db.json", JSON.stringify(db, null , 2));
  res.json({
    message : "added object",
    users: db.users
})
  
})

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
