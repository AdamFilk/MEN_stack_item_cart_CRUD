const express = require("express");
const app = express();
const mongodb = `mongodb+srv://aungchanoo:Mynameisaung2@cluster0.vyg2n.mongodb.net/item-database?retryWrites=true&w=majority`;
const item = require("./models/items");
const mongoose = require("mongoose");
const Item = require("./models/items");
app.use(express.urlencoded({ extended: true }));
mongoose
  .connect(mongodb)
  .then(() => {
    console.log("mongodb connected");
    app.listen(3000);
  })
  .catch((err) => console.log(err));
app.set("view engine", "ejs");
app.get("/create-item", (req, res) => {
  const item = new Item({
    name: "phone",
    price: 3000,
  });
  item
    .save()
    .then((result) => res.send(result))
    .catch((err) => console.log(err));
});

app.get("/", (req, res) => {
  //   res.sendFile("./views/index.html", { root: __dirname });
  res.redirect("/get-items");
});
app.get("/get-items", (req, res) => {
  Item.find()
    .then((result) => res.render("index", { items: result }))
    .catch((err) => res.send(err));
});
app.get("/add-items", (req, res) => {
  //   res.sendFile("./views/add_items.html", { root: __dirname });
  res.render("add_items");
});

app.post("/items", (req, res) => {
  const item = Item(req.body);
  item
    .save()
    .then(() => res.redirect("/get-items"))
    .catch((err) => console.log(err));
});
app.get("/items/:id", (req, res) => {
  const id = req.params.id;
  Item.findById(id)
    .then((result) => {
      console.log(result);
      res.render("item-detail", { item: result });
    })
    .catch((err) => console.log(err));
});
app.delete("/items/:id", (req, res) => {
  const id = req.params.id;
  Item.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/get-items" });
    })
    .catch((err) => console.log(err));
});
app.put("/items/:id", (req, res) => {
  const id = req.params.id;
  Item.findByIdAndUpdate(id, req.body)
    .then((result) => {
      res.json({ msg: "Updated Successfully" });
    })
    .catch((err) => console.log(err));
});
app.use((req, res) => {
  //   res.sendFile("./views/404.html", { root: __dirname });
  res.render("404");
});
