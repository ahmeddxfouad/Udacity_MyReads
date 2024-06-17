import  { useNavigate } from "react-router-dom";
import { useState } from "react";
import { search } from "./BooksAPI";

export default function Search( props: {
    books:any,
    shelfs: any,
    beautifyShelf: any,
    updateBookShelf: any,
}){
    const [searchedBooks, setSearchedBooks] = useState([]);
    const navigate = useNavigate();

    const searchBooks = async (query) => {
        if (!query) {
            setSearchedBooks([]);
            return;
        }
        try {
            const searched = await search(query);
            // setCurrentAvaialable(books.filter((b) => b.title.includes(query) ? b : null));
            // console.log('curravailable: ', curravailable)
            if (searched.error) {
                setSearchedBooks([]);
            } else {
                console.log('searched: ',query, ' ', searched)
                setSearchedBooks(searched);
            }
        } catch (error) {
            console.error('Failed to search books:', error);
            setSearchedBooks([]);
        }
    };
    const getBookShelf =(book) => {
        let foundBook = props.books.filter((b) => b.id === book.id);
        console.log('foundBook: ',foundBook)
        if(foundBook){
            return foundBook.shelf
        }else{
            return "none";
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
                        onChange={(e) => searchBooks(e.target.value)}
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
                                            value={getBookShelf(book)}
                                            onChange={(e) => props.updateBookShelf(book, e.target.value)}
                                        >
                                            <option value="none" disabled>
                                                Move to...
                                            </option>
                                            {props.shelfs.map((s) => (
                                                <option key={s} value={s}>
                                                    {props.beautifyShelf(s)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="book-title">{book.title}</div>
                                <div className="book-authors">{book.authors.join(', ')}</div>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}
