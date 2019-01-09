import React from 'react'

const Inventory = (props) => {
    const books = props.books.map(function (book, index) {
        return (
            <li key={index}><div>{book.name}</div><div>{book.isbn}</div></li>
        )
    })

    return (
        <ul>
            {books}
        </ul>
    )
}

export default Inventory