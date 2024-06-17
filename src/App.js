import "./App.css";
import {BrowserRouter as Router, Routes, Route, Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getAll, search, update} from "./BooksAPI";
import BookList from "./BookList";
import Search from "./Search";

const BookState = Object.freeze({
  CurrentlyReading: 'currentlyReading',
  WantToRead: 'wantToRead',
  Read: 'read',
  None: 'none'
});

export default function App() {
  const [shelves, setShelves] = useState([BookState.CurrentlyReading, BookState.WantToRead, BookState.Read, BookState.None]);
  const [books, setBooks] = useState([]);
  const [currentBooks, setCurrentBooks] = useState();

    useEffect(() => {
        getAllBooks();
    }, []);

    useEffect(() => {
        setCurrentBooks( books.map(book => ({
            id: book.id,
            state: book.shelf
        })));
    }, [books]);

    const getAllBooks = async () => {
        try {
            const newBooks = await getAll();
            console.log('new Books: ', newBooks);
            setBooks(newBooks);
        } catch (error) {
            console.error('Failed to fetch books:', error);
        }
    };

    const updateBookShelf = async (book, shelf) => {
        console.log('updateshelf book: ',shelf)
        const updatedBooks = books.filter(b => b.title !== book.title);
        const updatedBook = {
            ...book,
            shelf: shelf
        };
        await update(book, shelf);
        setBooks([...updatedBooks, updatedBook]);
    };

    const beautifyShelf = (shelf) =>{
        if(shelf === BookState.Read){
            return "Read";
        }
        else if (shelf === BookState.WantToRead)
        {
            return "Want to Read"
        }
        else if (shelf === BookState.CurrentlyReading)
        {
            return "Currently Reading"
        }
        else  return  "None"
    }

    return(
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/" element={
                        <BookList
                            books={books}
                            shelves={shelves}
                            BookState={BookState}
                            beautifyShelf={beautifyShelf}
                            updateBookShelf={updateBookShelf}
                        />
                    } />
                    <Route path="/search" element={
                        <Search
                            books={books}
                            shelves={shelves}
                            beautifyShelf={beautifyShelf}
                            updateBookShelf={updateBookShelf}
                            currentBooks={currentBooks}
                            BooksState={BookState}
                        />}
                    />
                </Routes>
            </div>
        </Router>
    );

}
