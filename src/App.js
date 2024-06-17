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
})


function App() {
  const [showSearchPage, setShowSearchpage] = useState(false);
  const [shelfs, setShelfs] = useState([BookState.CurrentlyReading, BookState.WantToRead, BookState.Read, BookState.None]);
    const [books, setBooks] = useState([]);
  // const [books, setBooks] = useState([{
  //     cover: 'http://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73-GnPVEyb7MOCxDzOYF1PTQRuf6nCss9LMNOSWBpxBrz8Pm2_mFtWMMg_Y1dx92HT7cUoQBeSWjs3oEztBVhUeDFQX6-tWlWz1-feexS0mlJPjotcwFqAg6hBYDXuK_bkyHD-y&source=gbs_api',
  //     title: 'To Kill a Mockingbird',
  //     author: 'Harper Lee',
  //     state: BookState.CurrentlyReading
  //     },
  //     {
  //         cover: 'http://books.google.com/books/content?id=yDtCuFHXbAYC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72RRiTR6U5OUg3IY_LpHTL2NztVWAuZYNFE8dUuC0VlYabeyegLzpAnDPeWxE6RHi0C2ehrR9Gv20LH2dtjpbcUcs8YnH5VCCAH0Y2ICaKOTvrZTCObQbsfp4UbDqQyGISCZfGN&source=gbs_api',
  //         title: 'Ender\'s Game',
  //         author: 'Orson Scott Card',
  //         state: BookState.CurrentlyReading
  //     },
  //     {
  //         cover: 'http://books.google.com/books/content?id=uu1mC6zWNTwC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73pGHfBNSsJG9Y8kRBpmLUft9O4BfItHioHolWNKOdLavw-SLcXADy3CPAfJ0_qMb18RmCa7Ds1cTdpM3dxAGJs8zfCfm8c6ggBIjzKT7XR5FIB53HHOhnsT7a0Cc-PpneWq9zX&source=gbs_api',
  //         title: '1776',
  //         author: 'David McCullough',
  //         state: BookState.WantToRead
  //     },
  //     {
  //         cover: 'http://books.google.com/books/content?id=wrOQLV6xB-wC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72G3gA5A-Ka8XjOZGDFLAoUeMQBqZ9y-LCspZ2dzJTugcOcJ4C7FP0tDA8s1h9f480ISXuvYhA_ZpdvRArUL-mZyD4WW7CHyEqHYq9D3kGnrZCNiqxSRhry8TiFDCMWP61ujflB&source=gbs_api',
  //         title: 'Harry Potter and the Sorcerer\'s Stone',
  //         author: 'J.K. Rowling',
  //         state: BookState.WantToRead
  //     },
  //     {
  //         cover: 'http://books.google.com/books/content?id=pD6arNyKyi8C&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE70Rw0CCwNZh0SsYpQTkMbvz23npqWeUoJvVbi_gXla2m2ie_ReMWPl0xoU8Quy9fk0Zhb3szmwe8cTe4k7DAbfQ45FEzr9T7Lk0XhVpEPBvwUAztOBJ6Y0QPZylo4VbB7K5iRSk&source=gbs_api',
  //         title: 'The Hobbit',
  //         author: 'J.R.R. Tolkien',
  //         state: BookState.Read
  //     },
  //     {
  //         cover: 'http://books.google.com/books/content?id=1q_xAwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE712CA0cBYP8VKbEcIVEuFJRdX1k30rjLM29Y-dw_qU1urEZ2cQ42La3Jkw6KmzMmXIoLTr50SWTpw6VOGq1leINsnTdLc_S5a5sn9Hao2t5YT7Ax1RqtQDiPNHIyXP46Rrw3aL8&source=gbs_api',
  //         title: 'Oh, the Places You\'ll Go!',
  //         author: 'Seuss',
  //         state: BookState.Read
  //     },
  //     {
  //         cover: 'http://books.google.com/books/content?id=32haAAAAMAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72yckZ5f5bDFVIf7BGPbjA0KYYtlQ__nWB-hI_YZmZ-fScYwFy4O_fWOcPwf-pgv3pPQNJP_sT5J_xOUciD8WaKmevh1rUR-1jk7g1aCD_KeJaOpjVu0cm_11BBIUXdxbFkVMdi&source=gbs_api',
  //         title: 'The Adventures of Tom Sawyer',
  //         author: 'Mark Twain',
  //         state: BookState.Read
  //     }
  // ]);

    useEffect(() => {
        setLoading(true);
        getAllBooks();
        setLoading(false);
    }, []);

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
        }else  return  "None"
    }

    return(
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/" element={
                        <BookList
                            books={books}
                            shelfs={shelfs}
                            BookState={BookState}
                            beautifyShelf={beautifyShelf}
                            updateBookShelf={updateBookShelf}
                        />
                    } />
                    <Route path="/search" element={
                        <Search
                            books={books}
                            shelfs={shelfs}
                            beautifyShelf={beautifyShelf}
                            updateBookShelf={updateBookShelf}
                        />}
                    />
                </Routes>
            </div>
        </Router>
    );

    // return (
    //     <div className="app">
    //         {showSearchPage ? (
    //             <div className="search-books">
    //                 <div className="search-books-bar">
    //                     <a
    //                         className="close-search"
    //                         onClick={() => setShowSearchpage(!showSearchPage)}
    //         >
    //           Close
    //         </a>
    //         <div className="search-books-input-wrapper">
    //           <input
    //             type="text"
    //             placeholder="Search by title, author, or ISBN"
    //             onChange={(e) => searchBooks(e.target.value)}
    //           />
    //         </div>
    //       </div>
    //       <div className="search-books-results">
    //         <ol className="books-grid">
    //             {
    //                 searchedBooks.map((book) => {
    //                     return (
    //                         <li>
    //                             <div className="book">
    //                                 <div className="book-top">
    //                                     <div
    //                                         className="book-cover"
    //                                         style={{
    //                                             width: 128,
    //                                             height: 193,
    //                                             backgroundImage:
    //                                                 `url(${book?.imageLinks?.smallThumbnail})`,
    //                                         }}
    //                                     ></div>
    //                                     <div className="book-shelf-changer">
    //                                         <select
    //                                             value={BookState.None}
    //                                             onChange={(e) => updateBookShelf(book, e.target.value)}
    //                                         >
    //                                             <option value="none" disabled>
    //                                                 Move to...
    //                                             </option>
    //                                             {shelfs.map((s) => {
    //                                                     return  <option>
    //                                                         {s}
    //                                                     </option>
    //                                                 }
    //                                             )}
    //                                         </select>
    //                                     </div>
    //                                 </div>
    //                                 <div className="book-title">{book.title}</div>
    //                                 <div className="book-authors">{book.authors}</div>
    //                             </div>
    //                         </li>)
    //                 })
    //             }
    //         </ol>
    //       </div>
    //     </div>
    //   ) : ( loading ? <div> Loading </div> :
    //     <div className="list-books">
    //       <div className="list-books-title">
    //         <h1>MyReads</h1>
    //       </div>
    //       <div className="list-books-content">
    //           { shelfs.filter((s) => s !== BookState.None).map( (shelf) => {
    //               return(
    //                   <div>
    //                       <div className="bookshelf">
    //                           <h2 className="bookshelf-title">{beautifyShelf(shelf)}</h2>
    //                           <div className="bookshelf-books">
    //                               <ol className="books-grid">
    //                                   {
    //                                       books.filter((book) => { return book.shelf === shelf}).map((book) => {
    //                                           return (
    //                                           <li>
    //                                               <div className="book">
    //                                                   <div className="book-top">
    //                                                       <div
    //                                                           className="book-cover"
    //                                                           style={{
    //                                                               width: 128,
    //                                                               height: 193,
    //                                                               backgroundImage:
    //                                                                   `url(${book.imageLinks.smallThumbnail})`,
    //                                                           }}
    //                                                       ></div>
    //                                                       <div className="book-shelf-changer">
    //                                                           <select
    //                                                               value={book.shelf}
    //                                                               onChange={(e) => updateBookShelf(book, e.target.value)}
    //                                                           >
    //                                                               <option value="none" disabled>
    //                                                                   Move to...
    //                                                               </option>
    //                                                               {shelfs.map((s) => {
    //                                                                       return <option key={s}>
    //                                                                           {s}
    //                                                                       </option>
    //                                                                   }
    //                                                               )}
    //                                                           </select>
    //                                                       </div>
    //                                                   </div>
    //                                                   <div className="book-title">{book.title}</div>
    //                                                   <div className="book-authors">{book.authors.map((auth) => {
    //                                                       return <div>{auth}</div>
    //                                                   })}</div>
    //                                               </div>
    //                                           </li>)
    //                                       })
    //                                   }
    //                               </ol>
    //                           </div>
    //                       </div>
    //                   </div>
    //               )
    //           }
    //           )}
    //           <div>
    //         </div>
    //       </div>
    //         <div className="open-search">
    //             <a onClick={() => setShowSearchpage(!showSearchPage)}>Add a book</a>
    //         </div>
    //     </div>
    //         )}
    //     </div>
    // );
}

export default App;
