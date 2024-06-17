import  { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import { search } from "./BooksAPI";

export default function Search( props: {
    books:any,
    shelves: any,
    beautifyShelf: any,
    updateBookShelf: any,
    currentBooks: any,
    BooksState: any,
}){
    const [searchedBooks, setSearchedBooks] = useState([]);
    const navigate = useNavigate();

    useEffect( () => {
        let s = searchedBooks.map( (book) => {
            let bookShelf = getBookShelf(book);
            return {...book, shelf: bookShelf}
        });
        console.log('s: ', s);
        setSearchedBooks(s);
    }, [props.books])

    const searchBooks = async (query) => {
        query = query.target.value;
        if (!query) {
            setSearchedBooks([]);
            return;
        }
        try {
            const searched = await search(query);
            if (searched.error) {
                setSearchedBooks([]);
            } else {
                let s = searched.map( (book) => {
                    let bookShelf = getBookShelf(book);
                        return {...book, shelf: bookShelf}
                });
                console.log('s: ', s);
                setSearchedBooks(s);
            }
        } catch (error) {
            console.error('Failed to search books:', error);
            setSearchedBooks([]);
        }
    };

    const getBookShelf = (book) => {
        let foundBook = props.books.find((b) => b.id === book.id);
        if (foundBook) {
            return foundBook.shelf;
        } else {
            return props.BooksState.None;
        }
    }


    return (
        <div className="search-books">
            <div className="search-books-bar">
                <a
                    className="close-search"
                    onClick={() => navigate('/')}
                >
                    Close
                </a>
                <div className="search-books-input-wrapper">
                    <input
                        type="text"
                        placeholder="Search by title, author, or ISBN"
                        onChange={searchBooks}
                    />
                </div>
            </div>
            <div className="search-books-results">
                <ol className="books-grid">
                    {searchedBooks.map((book) => (
                        <li key={book.id}>
                            <div className="book">
                                <div className="book-top">
                                    <div
                                        className="book-cover"
                                        style={{
                                            width: 128,
                                            height: 193,
                                            backgroundImage: `url(${book?.imageLinks?.smallThumbnail})`,
                                        }}
                                    ></div>
                                    <div className="book-shelf-changer">
                                        <select
                                            value={book.shelf ? book.shelf : props.BooksState.None}
                                            onChange={(e) => props.updateBookShelf(book, e.target.value)}
                                        >
                                            <option value="move" disabled>
                                                Move to...
                                            </option>
                                            {props.shelves.map((s) => (
                                                <option key={s} value={s}>
                                                    {props.beautifyShelf(s)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="book-title">{book.title}</div>
                                <div className="book-authors">{book.authors ? book.authors.join(', ') : ''}</div>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}
