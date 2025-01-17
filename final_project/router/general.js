const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function doesExist(username) {
  const user = users.find((user) => user.username === username);

  return !!user;
}
public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username, password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(books), 600);
  });

  promise.then((result) => {
    return res.status(200).json({ books: result });
  });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  //Write your code here
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(books[req.params.isbn]), 600);
  });

  const book = await promise;

  if (book) {
    return res.status(200).json({ book });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  //Write your code here
  const authorName = req.params.author;
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const filteredBooks = Object.values(books).filter(
        (b) => b.author === authorName
      );
      resolve(filteredBooks);
    }, 600);
  });

  const filteredBooks = await promise;

  if (filteredBooks.length > 0) {
    return res.status(200).json({ books: filteredBooks });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  //Write your code here
  const title = req.params.title;

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const filteredBooks = Object.values(books).filter(
        (b) => b.title === title
      );
      return resolve(filteredBooks);
    }, 600);
  });

  const filteredBooks = await promise;

  if (filteredBooks.length > 0) {
    return res.status(200).json({ books: filteredBooks });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  return res.status(200).json({ reviews: books[isbn].reviews });
});
// Task 10
// Add the code for getting the list of books available in the shop (done in Task 1) using Promise callbacks or async-await with Axios

function getBookList() {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
}

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  getBookList().then(
    (bk) => res.send(JSON.stringify(bk, null, 4)),
    (error) => res.send("denied")
  );
});

// Task 11
// Add the code for getting the book details based on ISBN (done in Task 2) using Promise callbacks or async-await with Axios.

function getFromISBN(isbn) {
  let book_ = books[isbn];
  return new Promise((resolve, reject) => {
    if (book_) {
      resolve(book_);
    } else {
      reject("Unable to find book!");
    }
  });
}

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  getFromISBN(isbn).then(
    (bk) => res.send(JSON.stringify(bk, null, 4)),
    (error) => res.send(error)
  );
});

// Task 12
// Add the code for getting the book details based on Author (done in Task 3) using Promise callbacks or async-await with Axios.

function getFromAuthor(author) {
  let output = [];
  return new Promise((resolve, reject) => {
    for (var isbn in books) {
      let book_ = books[isbn];
      if (book_.author === author) {
        output.push(book_);
      }
    }
    resolve(output);
  });
}

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  getFromAuthor(author).then((result) =>
    res.send(JSON.stringify(result, null, 4))
  );
});

// Task 13
// Add the code for getting the book details based on Title (done in Task 4) using Promise callbacks or async-await with Axios.

function getFromTitle(title) {
  let output = [];
  return new Promise((resolve, reject) => {
    for (var isbn in books) {
      let book_ = books[isbn];
      if (book_.title === title) {
        output.push(book_);
      }
    }
    resolve(output);
  });
}

module.exports.general = public_users;
