const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let {username, password} = req.body;
  if (username && password) {
    if (isValid(username)) {
      users.push({"username":username, "password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books));
});

public_users.get('/async/', async function (req, res) {
    try {
        let response = await axios.get('https://tandoan-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/');
        res.send(JSON.stringify(response.data));
    } catch (error) {
        res.status(500).json({message: "Internal error"});
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  res.send(JSON.stringify(books[req.params.isbn]));
 });

public_users.get('/async/isbn/:isbn', async function (req, res) {
    try {
        let response = await axios.get('https://tandoan-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/' + req.params.isbn);
        res.send(JSON.stringify(response.data));
    } catch (error) {
        res.status(500).json({message: "Internal error"});
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let keys = Object.keys(books);
    let bookArr = keys.map(k => books[k]);
  res.send(JSON.stringify(bookArr.filter(b => b.author == req.params.author)));
});

public_users.get('/async/author/:author', async function (req, res) {
    try {
        let response = await axios.get('https://tandoan-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/' + req.params.author);
        res.send(JSON.stringify(response.data));
    } catch (error) {
        res.status(500).json({message: "Internal error"});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let keys = Object.keys(books);
    let bookArr = keys.map(k => books[k]);
  res.send(JSON.stringify(bookArr.filter(b => b.title == req.params.title)));
});

public_users.get('/async/title/:title', async function (req, res) {
    try {
        let response = await axios.get('https://tandoan-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/' + req.params.title);
        res.send(JSON.stringify(response.data));
    } catch (error) {
        res.status(500).json({message: "Internal error"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    res.send(JSON.stringify(books[req.params.isbn].reviews));
});

module.exports.general = public_users;
