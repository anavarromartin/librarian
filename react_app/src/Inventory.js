import React, { Component } from 'react'

class Inventory extends Component {
    render() {
        const books = this.props.books.map(function (book, index) {
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
}

export default Inventory