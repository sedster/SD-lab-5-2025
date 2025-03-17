const express = require('express');
const app = express ();
app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

const books = [];

//whoami
app.get("/whoami", (req, res) => {
    const status = {
        "Status": "2556824"
    }
    res.send(status);
});

// books
app.get("/books", (req, res) => {
    res.send(books);
});

// books/:id

app.get("/books/:id", (req, res) => {
        const id = req.params.id;
        let mybook = null;

        for (let i = 0; i < books.length; i++) {
            if (id === books[i].id) {
                mybook = books[i];
                break;
            }
        }

        if (mybook) {
            console.log("Book found:", mybook);
            res.send(mybook);
        } else {
            console.log("Book not found");
            res.status(404).send({ message: "404 Not Found" });
        }
});
// add-book

app.post("/books", (req, res) => {
    const { id, title, details } = req.body
        
    if (!id || !title || !details || !details[0].id || !details[0].author || !details[0].genre || !details[0].publicationYear){
            console.log("Invalid book");
            res.status(400).send({ message: "400 Bad Request" });
        }
        else{
            books.push(req.body);
            console.log("Added new book successfully");
        }

});

//put-changes
app.put("/books/:id", (req, res) => {
    const givenId = req.params.id;
    const bookIndex = books.findIndex(book => book.id === givenId);

    if (bookIndex < 0 || bookIndex >= books.length) {
        return res.status(404).send({ message: "404 not found" });
    }

    const unupdatedBook = books[bookIndex];

    const updatedBook = {
        id: givenId, title: req.body.title || unupdatedBook.title, details: req.body.details ? req.body.details : unupdatedBook.details
    };

    books[bookIndex] = updatedBook;
    res.send({ message: "Book updated successfully", book: updatedBook });
});

//delete-book
app.delete("/books/:id", (req, res) => {
    const givenId = req.params.id;
    const bookIndex = books.findIndex(book => book.id === givenId);

    if (bookIndex < 0 || bookIndex >= books.length) {
        return res.status(404).send({ message: "404 not found" });
    }
    else{
    books.splice(bookIndex, 1);
    res.send({ message: "Deleted successfully" });
    }
});

//add-detail
app.post("/books/:id/details", (req, res) => {
    const bookId = req.params.id;
    const bookIndex = books.findIndex(book => book.id === bookId);

    if (bookIndex === -1) {
        return res.status(404).send({ message: "404 Not Found - Book does not exist" });
    }

    const { id, author, genre, publicationYear } = req.body;

    if (!id || !author || !genre || !publicationYear) {
        console.log("Invalid details");
        return res.status(400).send({ message: "400 Bad Request" });
    }

    books[bookIndex].details.push({ id, author, genre, publicationYear });

    console.log("Added new details successfully");

    return res.send({ message: "Details added successfully", book: books[bookIndex] });
});
//delete-detail
app.delete("/books/:id/details/:detailId", (req, res) => {
    const givenId = req.params.id;
    const detailId = req.params.detailId;

    const bookIndex = books.findIndex(book => book.id === givenId);
    if (bookIndex === -1) {
        res.status(404).send({ message: "404 Not Found" });
    }
    else{
        const bookDetails = books[bookIndex].details;

        const detailIndex = bookDetails.findIndex(detail => detail.id === detailId);
        if (detailIndex === -1) {
            res.status(404).send({ message: "404 Not Found" });
        }
        else{

            bookDetails.splice(detailIndex, 1);

            console.log("Deleted detail successfully");

            res.send({ message: "Detail deleted successfully", book: books[bookIndex] });
        }
    }
});




