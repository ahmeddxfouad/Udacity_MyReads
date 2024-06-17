import "./App.css";
import { Link } from "react-router-dom";

export default function BookList(props: {
    books:any,
    shelves: any,
    BookState: any,
    beautifyShelf: any,
    updateBookShelf: any,

}){

    return(
    <div className="list-books">
        <div className="list-books-title">
            <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
            {props.shelves.filter((s) => s !== props.BookState.None).map((shelf) => (
                <div key={shelf}>
                    <div className="bookshelf">
                        <h2 className="bookshelf-title">{props.beautifyShelf(shelf)}</h2>
                        <div className="bookshelf-books">
                            <ol className="books-grid">
                                {props.books.filter((book) => book.shelf === shelf).map((book) => (
                                    <li key={book.id}>
                                        <div className="book">
                                            <div className="book-top">
                                                <div
                                                    className="book-cover"
                                                    style={{
                                                        width: 128,
                                                        height: 193,
                                                        backgroundImage: `url(${book.imageLinks.smallThumbnail})`,
                                                    }}
                                                ></div>
                                                <div className="book-shelf-changer">
                                                    <select
                                                        value={book.shelf}
                                                        onChange={(e) => props.updateBookShelf(book, e.target.value)}
                                                    >
                                                        <option value="none" disabled>
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
                                            <div className="book-authors">{book.authors.join(', ')}</div>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <div className="open-search">
            <Link to="/search">Add a book</Link>
        </div>
    </div>
    );
}
