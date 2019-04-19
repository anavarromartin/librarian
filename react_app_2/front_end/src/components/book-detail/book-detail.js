import React, {useEffect, useState} from 'react';
import './book-detail.scss'
import {faBookOpen} from "@fortawesome/free-solid-svg-icons/faBookOpen";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const BookDetail = ({
                        match,
                        office,
                        getBooksByIsbn,
                        getBookDescriptionByIsbn,
                        setBackLocation,
                        setHeaderConfig,
                    }) => {

    const [book, setBook] = useState({})
    const [bookDescription, setBookDescription] = useState('')

    useEffect(() => {
        setBackLocation(`/${office.name.toLowerCase()}`)
        setHeaderConfig({displayButtons: true})

        const isbn = match.params.isbn;

        getBooksByIsbn(office.id, isbn)
            .then(books => {
                console.log(`Got the book! ${JSON.stringify(books[0])}`)
                setBook(books[0])
            })

        getBookDescriptionByIsbn(isbn).then(description => {
            setBookDescription(description)
        })
    }, [])

    return (
        <div className={"book-detail__container"}>
            <div className={"book-detail__title"}>{book.book_name}</div>
            <div className={"book-detail__cover"}>
                {
                    book.imageLink
                        ? (<img className={"book-detail__image"} src={book.imageLink}/>)
                        : (<div className={"book-detail__no-image"}>No Image</div>)
                }
                <div className={"book-detail__available"}>
                    <FontAwesomeIcon style={{color: '#24364196', marginRight: '8px'}} icon={faBookOpen}/>
                    <span>{book.quantity} available</span>
                </div>
            </div>
            <div className={"book-detail__author"}>By {book.authors}</div>
            <div className={"book-detail__description"}>{bookDescription}</div>
        </div>
    )
}

export default BookDetail