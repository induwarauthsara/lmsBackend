const express = require("express");
const mongoose = require("mongoose");
const Book = require("./models/book");
const Member = require("./models/member");

const server = express();
const databaseURL =
    "mongodb+srv://induwara:induwara@cluster0.vb0bu.mongodb.net/lms?retryWrites=true&w=majority";

mongoose
    .connect(databaseURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((result) => {
        console.log("Database connected");
        port = 2000;
        server.listen(port, () => {
            console.log(`ExpressJS Server stared on port ${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

// ----------- Book API Implement ------------------

// GET all books
server.get("/book", async(req, res) => {
    const books = await Book.find();
    res.send(books);
});

// Get one book details
server.get("/book/:id", async(req, res) => {
    const id = req.params.id;
    const book = await Book.findById(id);
    res.send(book);
});

// Add new book
server.post("/book", async(req, res) => {
    const { title, author } = req.body;

    const book = new Book({ title, author });
    const response = await book.save();
    res.send(response);
});

// Burrow book
server.put("/book/:id/borrow", async(req, res) => {
    const id = req.params.id;
    const { burrowedMemberId, burrowedDate } = req.body;

    const book = await Book.findByIdAndUpdate(id, {
        burrowedMemberId,
        burrowedDate,
        isAvailable: false,
    });
    res.send(book);
});

// Return book
server.put("/book/:id/return", async(req, res) => {
    id = req.params.id;

    const book = await Book.findByIdAndUpdate(id, {
        burrowedMemberId: "",
        burrowedDate: "",
        isAvailable: true,
    });
    res.send(book);
});

// Delete book
server.delete("/book/:id", async(req, res) => {
    id = req.params.id;

    const book = await Book.findByIdAndDelete(id);
    res.send(book);
});

// Edit Book
server.put("/book/:id", async(req, res) => {
    id = req.params.id;
    const { title, author } = req.body;

    const book = await Book.findByIdAndUpdate(id, {
        title,
        author,
    });
    res.send(book);
});

// ----------- Member API Implement ------------------

// Get all members
server.get("/member", async(req, res) => {
    const members = await Member.find();
    res.send(members);
});

// Get one member
server.get("/member/:id", async(req, res) => {
    id = req.params.id;
    const member = await Member.findById(id);
    res.send(member);
});

// Create a new member
server.post("/member", async(req, res) => {
    const { nic, firstName, middleName, lastName, contactNo, address, userType } =
    req.body;
    const member = new Member({
        nic,
        firstName,
        middleName,
        lastName,
        contactNo,
        address,
        userType,
    });
    const response = await member.save();
    res.send(member);
});

//  Delete a member
server.delete("/member/:id", async(req, res) => {
    id = req.params.id;
    const member = await Member.findByIdAndDelete(id);
    res.send(member);
});

// Edit Member
server.put("/member/:id", async(req, res) => {
    id = req.params.id;
    const { nic, firstName, middleName, lastName, contactNo, address, userType } =
    req.body;
    const member = await Member.findByIdAndUpdate(id, {
        nic,
        firstName,
        middleName,
        lastName,
        contactNo,
        address,
        userType,
    });
    res.send(member);
});