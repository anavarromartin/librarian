import React, { Component } from 'react'
import Manage from './Manage'
import Inventory from './Inventory'
import { toast } from 'react-toastify'

class ManageContainer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            books: []
        }

        this.fetchBooks = this.fetchBooks.bind(this)
        this.saveBook = this.saveBook.bind(this)
    }

    componentDidMount() {
        this.fetchBooks()
    }

    async fetchBooks() {
        const url = `${process.env.REACT_APP_API_URL || window.location.origin}/api/offices/1/books`

        return fetch(url, {
            method: 'GET',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        }).then(response => {
            if (response.ok) {
                return response
            } else {
                throw Error(`Request rejected with status ${response.status}`)
            }
        }).then(response =>
            response.json().then(content => ({
                data: content.data,
                status: response.status
            }))
        ).then(res =>
            this.setState({
                books: res.data.books
            })
        ).catch(error => {
            throw error
        })
    }

    async saveBook(bookTitle, candidateISBN) {
        const url = `${process.env.REACT_APP_API_URL || window.location.origin}/api/offices/1/books`

        return fetch(url, {
            method: 'POST',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                name: bookTitle,
                isbn: candidateISBN,
            }),
        }).then(response => {
            if (response.ok) {
                return response
            } else {
                throw Error(`Request rejected with status ${response.status}`)
            }
        }).then(_ => {
            toast('Book saved!')
            this.fetchBooks()
        }).catch(error => {
            throw error
        })
    }

    render() {
        return (
            <div>
                <Manage saveBook={this.saveBook}/>
                <Inventory books={this.state.books} />
            </div>
        )
    }
}

export default ManageContainer