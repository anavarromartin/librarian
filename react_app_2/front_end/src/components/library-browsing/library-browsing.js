import React, {useState, useEffect} from 'react';
import BookSummary from "../book-summary/book-summary";
import './library-browsing.scss'

const LibraryBrowsing = ({getOfficeBooks}) => {

    const [books, setBooks] = useState([])

    useEffect (() => {
        const loadBooks = async () => setBooks(await getOfficeBooks(1))
        loadBooks()
    }, []);


    return (
        <div className={"library-browsing__container"}>
            {
                books
                    .map((book) => (
                        <div className={"library-browsing__book"}>
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