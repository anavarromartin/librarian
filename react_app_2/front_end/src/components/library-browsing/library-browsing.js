import React, {useState, useEffect} from 'react';
import BookSummary from "../book-summary/book-summary";
import './library-browsing.scss'

const LibraryBrowsing = ({getOfficeBooks, setHeaderConfig, history}) => {

    const [books, setBooks] = useState([])

    useEffect (() => {
        setHeaderConfig({
            displayButtons: true
        })
        const loadBooks = async () => setBooks(await getOfficeBooks(1))
        loadBooks()

        return () => setHeaderConfig({})
    }, []);


    return (
        <div className={"library-browsing__container"}>
            {
                books
                    .map((book) => (
                        <div
                            className={"library-browsing__book"}
                            onClick={() => {
                                // window.location.href = `${process.env.REACT_APP_API_URL || window.location.origin}/Dallas/books/${book.id}`
                            }}

                        >
                            <BookSummary
                                bookTitle={book.book_name}
                                quantity={book.quantity}
                                imageLink={book.imageLink}
                            />
                        </div>
                    ))
            }
        </div>
    )
}

export default LibraryBrowsing