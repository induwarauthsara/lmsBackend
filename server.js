const express = require("express");
const mongoose = require("mongoose");
const Book = require("./models/book");
const Member = require("./models/member");
const cors = require("cors");

const server = express();
const databaseURL =
    "mongodb+srv://induwara:induwara@cluster0.vb0bu.mongodb.net/lms?retryWrites=true&w=majority";

const PORT = process.env.PORT || 2000;

mongoose
    .connect(databaseURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((result) => {
        console.log("Database connected");
        server.listen(PORT, () => {
            console.log(`ExpressJS Server stared on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors());

// ----------- Book API Implement ------------------

const convertToBook = (book) => {
    return {
        id: book._id,
        title: book.title,
        author: book.author,
        isAvailable: book.isAvailable,
        burrowedMemberId: book.burrowedMemberId,
        burrowedDate: book.burrowedDate,
    };
};

const sendBook = async(req, id) => {
    const book = await Book.findById(id);
    res.send(convertToBook(book));
};

// GET all books
server.get("/book", async(req, res) => {
    const books = await Book.find();
    res.send(
        books.map((book) => {
            return convertToBook(book);
        })
    );
});

// Get one book details
server.get("/book/:id", async(req, res) => {
    const id = req.params.id;
    sendBook(res, id);
});

// Add new book
server.post("/book", async(req, res) => {
    const { title, author } = req.body;

    const book = new Book({
        title,
        author,
        isAvailable: true,
        burrowedMemberId: "",
        burrowedDate: "",
    });
    const response = await book.save();
    res.send(convertToBook(response));
});

// Burrow book
server.put("/book/:id/burrow", async(req, res) => {
    const id = req.params.id;
    const { burrowedMemberId, burrowedDate } = req.body;

    const book = await Book.findByIdAndUpdate(id, {
        isAvailable: false,
        burrowedMemberId,
        burrowedDate,
    });
    sendBook(res, id);
});

// Return book
server.put("/book/:id/return", async(req, res) => {
    id = req.params.id;

    const book = await Book.findByIdAndUpdate(id, {
        burrowedMemberId: "",
        burrowedDate: "",
        isAvailable: true,
    });
    sendBook(res, id);
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
    sendBook(res, id);
});

// ----------- Member API Implement ------------------

const convertToMember = (member) => {
    return {
        id: member._id,
        nic: member.nic,
        firstName: member.firstName,
        middleName: member.middleName,
        lastName: member.lastName,
        contactNo: member.contactNo,
        address: member.address,
        userType: member.userType,
    };
};

const sendMember = async(res, id) => {
    const member = await Member.findById(id);
    res.send(convertToMember(member));
};

// Get all members
server.get("/member", async(req, res) => {
    const members = await Member.find();
    res.send(
        members.map((member) => {
            return convertToMember(member);
        })
    );
});

// Get one member
server.get("/member/:id", async(req, res) => {
    id = req.params.id;
    sendMember(res, id);
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
    res.send(convertToMember(member));
});

//  Delete a member
server.delete("/member/:id", async(req, res) => {
    id = req.params.id;
    const member = await Member.findByIdAndDelete(id);
    sendMember(res, id);
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
    sendMember(res, id);
});